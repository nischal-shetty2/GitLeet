import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { formatDateString, normalizeDate } from "@/lib/calendarUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export const HeatmapGrid = ({
  platform,
  github,
  leetcode,
}: {
  platform: "github" | "leetcode";
  github: GitHubDataHook;
  leetcode: LeetCodeDataHook;
}) => {
  const data = useMemo(() => {
    // Make defensive copies of data to avoid reference issues
    const githubData = github.data ? [...github.data] : [];
    const leetcodeData = leetcode.data ? [...leetcode.data] : [];

    // Combine data from both sources with robust date handling
    const allActivities = [...githubData, ...leetcodeData];
    const activityMap = new Map<string, number>();

    // Ensure consistent date parsing and normalize date format using utility functions
    allActivities.forEach((activity) => {
      try {
        if (!activity.date) {
          console.warn("Activity with missing date found");
          return;
        }

        // Use the utility function for consistent date normalization
        const normalizedDate = normalizeDate(activity.date);

        if (normalizedDate) {
          // Accumulate activity count with normalized date
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
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (platform === "github") {
      // GitHub weekly view logic with improved date handling
      // Clone current date to avoid mutations
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 364); // 364 days = 52 weeks
      startDate.setHours(0, 0, 0, 0); // Normalize time component

      // Ensure start date is a Sunday (first day of GitHub week)
      while (startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() - 1);
      }

      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999); // End of the day

      // Calculate exact number of weeks needed (usually 53)
      const totalDays =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
        ) + 1;
      const totalWeeks = Math.ceil(totalDays / 7);

      // Initialize weeks with empty data
      const weeks: ActivityData[][] = Array(totalWeeks)
        .fill(null)
        .map(() =>
          Array(7)
            .fill(null)
            .map(() => ({ date: "", count: 0 }))
        );

      // Fill in all dates in the grid with precise date calculation
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const weekIndex = Math.floor(
          (currentDate.getTime() - startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );

        if (weekIndex >= 0 && weekIndex < totalWeeks) {
          const dayOfWeek = currentDate.getDay();

          // Use the utility function for consistent date formatting
          const dateStr = formatDateString(currentDate);

          // Ensure the slot exists before assignment
          if (weeks[weekIndex] && weeks[weekIndex][dayOfWeek]) {
            weeks[weekIndex][dayOfWeek] = {
              date: dateStr,
              count: 0,
            };
          }
        }

        // Add exactly one day (avoid timezone issues)
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Merge activity data into weeks with robust date matching
      combined.forEach((activity) => {
        try {
          if (!activity.date) return;

          // Try to find the exact date match first
          const exactMatch = findExactDateMatch(activity.date, weeks);
          if (exactMatch) {
            const { weekIndex, dayIndex } = exactMatch;
            weeks[weekIndex][dayIndex].count += activity.count;
            return;
          }

          // If no exact match found, calculate position by date
          const activityDate = new Date(activity.date);

          if (!isNaN(activityDate.getTime())) {
            // Set to start of day to match our grid dates
            activityDate.setHours(0, 0, 0, 0);

            const weekIndex = Math.floor(
              (activityDate.getTime() - startDate.getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            );

            const dayOfWeek = activityDate.getDay();

            if (weekIndex >= 0 && weekIndex < totalWeeks) {
              // Additional null check and assignment
              if (weeks[weekIndex] && weeks[weekIndex][dayOfWeek]) {
                weeks[weekIndex][dayOfWeek].count += activity.count;
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

      // Helper function to find exact date match in weeks grid
      function findExactDateMatch(
        dateStr: string,
        weeks: ActivityData[][]
      ): { weekIndex: number; dayIndex: number } | null {
        for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
          const week = weeks[weekIndex];
          for (let dayIndex = 0; dayIndex < week.length; dayIndex++) {
            if (week[dayIndex].date === dateStr) {
              return { weekIndex, dayIndex };
            }
          }
        }
        return null;
      }

      return { type: "github", weeks };
    } else {
      // LeetCode monthly view logic with improved date handling
      const months: { name: string; days: ActivityData[] }[] = [];

      // Clone dates to avoid mutation issues
      const now = new Date();
      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999); // End of current day

      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 11); // Go back 12 months (including current)
      startDate.setDate(1); // Start at the first day of month
      startDate.setHours(0, 0, 0, 0); // Start of day

      const currentDate = new Date(startDate);

      // Fill in the calendar with empty data for all months
      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get days in month using last day calculation (more reliable)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthDays: ActivityData[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
          // Ensure consistent date formatting with padded months and days
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

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

      // Create a month lookup map for faster access
      const monthMap = new Map<string, number>();
      months.forEach((m, index) => {
        if (m.days.length > 0) {
          // Use YYYY-MM as key
          const key = m.days[0].date.slice(0, 7);
          monthMap.set(key, index);
        }
      });

      // Merge activity data into months
      combined.forEach((activity) => {
        try {
          if (!activity.date) {
            console.warn("Activity with missing date found");
            return;
          }

          // Normalize date format if needed
          let normalizedDate = activity.date;
          if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
            // Convert any date format to YYYY-MM-DD
            const date = new Date(normalizedDate);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              normalizedDate = `${year}-${month}-${day}`;
            } else {
              console.warn("Could not normalize date:", activity.date);
              return;
            }
          }

          // Extract YYYY-MM from normalized date
          const key = normalizedDate.slice(0, 7);
          const monthIndex = monthMap.get(key);

          if (monthIndex !== undefined) {
            // Extract day from YYYY-MM-DD format
            const parts = normalizedDate.split("-");
            if (parts.length === 3) {
              const day = parseInt(parts[2], 10);

              // Ensure day is within valid range (1-based day in array with 0-based index)
              if (day > 0 && day <= months[monthIndex].days.length) {
                const dayIndex = day - 1;
                if (months[monthIndex].days[dayIndex]) {
                  months[monthIndex].days[dayIndex].count += activity.count;

                  // Double-check that the date in the data structure matches our expected date
                  const expectedDate = normalizedDate;
                  if (months[monthIndex].days[dayIndex].date !== expectedDate) {
                    console.warn(
                      `Date mismatch: expected ${expectedDate}, got ${months[monthIndex].days[dayIndex].date}`
                    );
                    // Fix the date in the data structure
                    months[monthIndex].days[dayIndex].date = expectedDate;
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

      return { type: "leetcode", months };
    }
  }, [platform, github.data, leetcode.data]);

  const getColorClass = (count: number) => {
    const baseColors = {
      github: [
        "bg-gray-100",
        "bg-green-200",
        "bg-green-300",
        "bg-green-500",
        "bg-green-700",
      ],
      leetcode: [
        "bg-gray-100",
        "bg-green-200",
        "bg-green-400",
        "bg-green-600",
        "bg-green-800",
      ],
    };

    const darkColors = {
      github: [
        "dark:bg-gray-800",
        "dark:bg-green-900",
        "dark:bg-green-700",
        "dark:bg-green-500",
        "dark:bg-green-300",
      ],
      leetcode: [
        "dark:bg-gray-800",
        "dark:bg-green-900",
        "dark:bg-green-700",
        "dark:bg-green-500",
        "dark:bg-green-300",
      ],
    };

    // Define thresholds for color intensity
    const thresholds = [0, 1, 4, 7, 10];

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) {
        return `${baseColors[platform][i]} ${darkColors[platform][i]}`;
      }
    }
    return `${baseColors[platform][0]} ${darkColors[platform][0]}`;
  };

  const chunkedDays = useMemo(() => {
    // Memoized chunking function for better performance
    return (days: ActivityData[], size: number) => {
      const chunks: ActivityData[][] = [];
      for (let i = 0; i < days.length; i += size) {
        chunks.push(days.slice(i, i + size));
      }
      return chunks;
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className={platform === "github" ? "inline-block" : "w-full"}>
        {data.type === "github" ? (
          // GitHub weekly view - horizontally scrollable on mobile
          <TooltipProvider>
            <div className="flex flex-nowrap gap-[2px] sm:gap-1 mx-auto">
              {data.weeks?.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-[2px] sm:gap-1">
                  {week.map((day, dayIndex) => (
                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring hover:ring-inset sm:hover:ring-[1px] hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
                            day?.count || 0
                          )}`}
                        />
                      </TooltipTrigger>
                      {day?.date && (
                        <TooltipContent side="top">
                          <p>{`${day.date}: ${day.count} activitiessss`}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>
        ) : (
          // LeetCode monthly view - adding more horizontal spacing on mobile
          <TooltipProvider>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 sm:gap-3 md:gap-4 max-w-fit mx-auto">
              {data.months?.map((month, monthIndex) => {
                const columns = chunkedDays(month.days, 7);

                return (
                  <div key={monthIndex} className="flex flex-col">
                    <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                      {month.name}
                    </div>
                    <div className="flex gap-[3px] sm:gap-[3px]">
                      {columns.map((column, colIndex) => (
                        <div
                          key={colIndex}
                          className="flex flex-col gap-[3px] sm:gap-[3px]">
                          {column.map((day, dayIndex) => (
                            <Tooltip key={dayIndex}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`w-[10px] h-[10px] sm:w-2 sm:h-2 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring hover:ring-inset sm:hover:ring-[1px] hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
                                    day.count
                                  )}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>{`${day.date}: ${day.count} activitiesss `}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
