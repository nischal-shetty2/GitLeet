import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { normalizeDate } from "@/lib/calendarUtils";
// Debug helper can be enabled during development if needed
// import { validateHeatmapData } from "@/lib/heatmapValidation";
import { AdaptiveTooltip } from "@/components/ui/adaptive-tooltip";

export const LeetCodeHeatmap = ({
  github,
  leetcode,
}: {
  github: GitHubDataHook;
  leetcode: LeetCodeDataHook;
}) => {
  // Memoized data processing to improve performance
  const data = useMemo(() => {
    // Performance optimization: Early exit if no data
    if (github.data.length === 0 && leetcode.data.length === 0) {
      return [];
    }

    // Combine data from both sources with robust date handling
    const allActivities = [...(github.data || []), ...(leetcode.data || [])];
    const activityMap = new Map<string, number>();

    // Ensure consistent date parsing using utility functions
    allActivities.forEach((activity) => {
      try {
        if (!activity.date) {
          console.warn("Activity with missing date found");
          return;
        }

        // Use utility function for consistent date normalization
        const normalizedDate = normalizeDate(activity.date);

        if (normalizedDate) {
          activityMap.set(
            normalizedDate,
            (activityMap.get(normalizedDate) || 0) + activity.count
          );
        }
      } catch (err) {
        console.error("Invalid date format:", err, "for date:", activity.date);
      }
    });

    const combined = Array.from(activityMap.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .filter((activity) => activity.date); // Ensure no empty dates

    // Debug validation - uncomment during development if issues arise
    // if (process.env.NODE_ENV === 'development') {
    //   const validation = validateHeatmapData(github.data || [], leetcode.data || []);
    //   if (!validation.valid) {
    //     console.warn('Heatmap validation issues:', validation.issues);
    //   }
    // }

    // Generate calendar months with improved date handling
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999); // End of current day

    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 11); // Go back 12 months (including current)
    startDate.setDate(1); // Start at the first day of month
    startDate.setHours(0, 0, 0, 0); // Start of day

    const months: { name: string; days: ActivityData[] }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      // Get days in month using last day calculation (more reliable)
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const monthDays: ActivityData[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        // Use the date utility function for consistent formatting
        const dayDate = new Date(year, month, day);
        const dateStr = normalizeDate(dayDate.toString());
        monthDays.push({ date: dateStr, count: 0 });
      }

      months.push({
        name: currentDate.toLocaleString("default", { month: "short" }),
        days: monthDays,
      });

      // Move to first day of next month (avoiding date arithmetic issues)
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    }

    // Improved data merging with robust date parsing
    const monthMap = new Map<string, number>();
    months.forEach((m, index) => {
      if (m.days.length > 0) {
        const key = m.days[0].date.slice(0, 7);
        monthMap.set(key, index);
      }
    });

    combined.forEach((activity) => {
      try {
        if (!activity.date) {
          console.warn("Activity with missing date found");
          return;
        }

        // Use our utility function for normalization
        const normalizedDate = normalizeDate(activity.date);
        if (!normalizedDate) {
          console.warn("Could not normalize date:", activity.date);
          return;
        }

        const key = normalizedDate.slice(0, 7);
        const monthIndex = monthMap.get(key);

        if (monthIndex !== undefined) {
          // Extract day from YYYY-MM-DD format
          const parts = normalizedDate.split("-");
          if (parts.length === 3) {
            const day = parseInt(parts[2], 10);

            // Ensure day is within valid range
            if (day > 0 && day <= months[monthIndex].days.length) {
              const dayIndex = day - 1;
              if (months[monthIndex].days[dayIndex]) {
                months[monthIndex].days[dayIndex].count += activity.count;

                // Double-check that the date matches our expected date
                if (months[monthIndex].days[dayIndex].date !== normalizedDate) {
                  // Fix the date in the data structure if it doesn't match
                  months[monthIndex].days[dayIndex].date = normalizedDate;
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(
          "Error processing activity date:",
          err,
          "for date:",
          activity.date
        );
      }
    });

    return months;
  }, [github.data, leetcode.data]);

  // Memoize color class to avoid recalculations
  const getColorClass = React.useCallback((count: number) => {
    const baseColors = [
      "bg-gray-100",
      "bg-green-200",
      "bg-green-400",
      "bg-green-600",
      "bg-green-800",
    ];

    const darkColors = [
      "dark:bg-gray-800",
      "dark:bg-yellow-900",
      "dark:bg-yellow-700",
      "dark:bg-yellow-500",
      "dark:bg-yellow-300",
    ];

    const thresholds = [0, 1, 4, 7, 10];

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) {
        return `${baseColors[i]} ${darkColors[i]}`;
      }
    }
    return `${baseColors[0]} ${darkColors[0]}`;
  }, []);

  const chunkedDays = React.useCallback(
    (days: ActivityData[], size: number) => {
      const chunks: ActivityData[][] = [];
      for (let i = 0; i < days.length; i += size) {
        chunks.push(days.slice(i, i + size));
      }
      return chunks;
    },
    []
  );

  // If there's no data, show an empty state message
  if (data.length === 0) {
    return (
      <div className="w-full text-center py-6 text-muted-foreground">
        <p>
          No activity data available. Enter a username to view contributions.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-x-auto pb-1"
      role="region"
      aria-label="Activity heatmap by month">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-3 md:gap-4 max-w-fit mx-auto">
          {data.map((month, monthIndex) => {
            const columns = chunkedDays(month.days, 7);
            // Use a more stable key format including month name
            const monthKey = `month-${monthIndex}-${month.name}`;

            return (
              <div key={monthKey} className="flex flex-col">
                <div className="text-sm sm:text-sm font-medium mb-2 sm:mb-2">
                  {month.name}
                </div>
                <div className="flex gap-[4px] p-1 sm:gap-[3px]">
                  {columns.map((column, colIndex) => (
                    <div
                      key={`col-${monthKey}-${colIndex}`}
                      className="flex flex-col gap-[4px] sm:gap-[3px]">
                      {column.map((day, dayIndex) => (
                        <AdaptiveTooltip
                          key={`day-${day.date}-${dayIndex}`}
                          content={
                            <>
                              <span className="font-medium">
                                {new Date(day.date).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              <br />
                              <span>
                                {day.count}{" "}
                                {day.count === 1 ? "activity" : "activities"}
                              </span>
                            </>
                          }>
                          <div
                            className={`w-[12px] h-[12px] sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-500 hover:ring-offset-0 ${getColorClass(
                              day.count
                            )}`}
                            role="gridcell"
                            aria-label={`${day.date}: ${day.count} ${
                              day.count === 1 ? "activity" : "activities"
                            }`}
                          />
                        </AdaptiveTooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeetCodeHeatmap;
