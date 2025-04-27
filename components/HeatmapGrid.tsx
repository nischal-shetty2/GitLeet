import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";

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

    // Ensure consistent date parsing and normalize date format
    allActivities.forEach((activity) => {
      try {
        // Create a new Date object to handle various input formats
        const date = new Date(activity.date);

        // Ensure we have a valid date
        if (!isNaN(date.getTime())) {
          // Use ISO format for consistent date formatting
          const dateStr = date.toISOString().split("T")[0];
          // Accumulate activity count
          activityMap.set(
            dateStr,
            (activityMap.get(dateStr) || 0) + activity.count
          );
        }
      } catch (err) {
        console.error("Invalid date format:", err);
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
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);

      // Ensure start date is the most recent Sunday (first day of GitHub week)
      while (startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() - 1);
      }

      const endDate = new Date();
      // Initialize weeks with empty data
      const weeks: ActivityData[][] = Array(53)
        .fill(null)
        .map(() =>
          Array(7)
            .fill(null)
            .map(() => ({ date: "", count: 0 }))
        );

      // Fill in all dates in the grid
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const weekIndex = Math.floor(
          (currentDate.getTime() - startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );

        if (weekIndex >= 0 && weekIndex < 53) {
          const dayOfWeek = currentDate.getDay();
          const dateStr = currentDate.toISOString().split("T")[0];

          // Ensure the slot exists before assignment
          if (weeks[weekIndex] && weeks[weekIndex][dayOfWeek]) {
            weeks[weekIndex][dayOfWeek] = {
              date: dateStr,
              count: 0,
            };
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Merge activity data into weeks with robust date matching
      combined.forEach((activity) => {
        try {
          const activityDate = new Date(activity.date);

          if (!isNaN(activityDate.getTime())) {
            const weekIndex = Math.floor(
              (activityDate.getTime() - startDate.getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            );

            if (weekIndex >= 0 && weekIndex < 53) {
              const dayOfWeek = activityDate.getDay();

              // Additional null check and assignment
              if (weeks[weekIndex] && weeks[weekIndex][dayOfWeek]) {
                weeks[weekIndex][dayOfWeek].count += activity.count;
              }
            }
          }
        } catch (err) {
          console.error("Error processing activity date:", err);
        }
      });

      return { type: "github", weeks };
    } else {
      // LeetCode monthly view logic with improved date handling
      const months: { name: string; days: ActivityData[] }[] = [];
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1); // Start at the first day of month

      const currentDate = new Date(startDate);

      // Fill in the calendar with empty data for all months
      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get days in month using last day calculation
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

        // Move to first day of next month
        currentDate.setMonth(currentDate.getMonth() + 1);
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
          // Extract YYYY-MM from date
          const key = activity.date.slice(0, 7);
          const monthIndex = monthMap.get(key);

          if (monthIndex !== undefined) {
            // Extract day from YYYY-MM-DD format
            const parts = activity.date.split("-");
            if (parts.length === 3) {
              const day = parseInt(parts[2], 10);

              // Ensure day is within valid range (1-based day in array with 0-based index)
              if (day > 0 && day <= months[monthIndex].days.length) {
                const dayIndex = day - 1;
                if (months[monthIndex].days[dayIndex]) {
                  months[monthIndex].days[dayIndex].count += activity.count;
                }
              }
            }
          }
        } catch (err) {
          console.error("Error processing activity date:", err);
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

  const chunkedDays = (days: ActivityData[], size: number) => {
    const chunks: ActivityData[][] = [];
    for (let i = 0; i < days.length; i += size) {
      chunks.push(days.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className={platform === "github" ? "inline-block" : "w-full"}>
        {data.type === "github" ? (
          // GitHub weekly view - horizontally scrollable on mobile
          <div className="flex flex-nowrap gap-[2px] sm:gap-1 mx-auto">
            {data.weeks?.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring-1 sm:hover:ring-2 hover:ring-offset-1 sm:hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
                      day?.count || 0
                    )}`}
                    title={
                      day?.date
                        ? `${day.date}: ${day.count} activities`
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          // LeetCode monthly view - adding more horizontal spacing on mobile
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
                          <div
                            key={dayIndex}
                            className={`w-[10px] h-[10px] sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring-1 sm:hover:ring-2 hover:ring-offset-1 sm:hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
                              day.count
                            )}`}
                            title={`${day.date}: ${day.count} activities`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapGrid;
