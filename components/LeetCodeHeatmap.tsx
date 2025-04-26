import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";

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

    // Ensure consistent date parsing
    allActivities.forEach((activity) => {
      const date = new Date(activity.date);
      if (!isNaN(date.getTime())) {
        const dateStr = date.toISOString().split("T")[0];
        if (activity.count > 0) {
          activityMap.set(
            dateStr,
            (activityMap.get(dateStr) || 0) + activity.count
          );
        }
      }
    });

    const combined = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // Generate calendar months
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);

    const months: { name: string; days: ActivityData[] }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const monthDays: ActivityData[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        monthDays.push({ date: dateStr, count: 0 });
      }

      months.push({
        name: currentDate.toLocaleString("default", { month: "short" }),
        days: monthDays,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
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
      const key = activity.date.slice(0, 7);
      const monthIndex = monthMap.get(key);

      if (monthIndex !== undefined) {
        // Robust day extraction and parsing
        const parts = activity.date.split("-");
        if (parts.length === 3) {
          const day = parseInt(parts[2], 10);

          // Ensure day is within valid range
          if (day > 0 && day <= months[monthIndex].days.length) {
            const dayIndex = day - 1;
            if (months[monthIndex].days[dayIndex]) {
              months[monthIndex].days[dayIndex].count += activity.count;
            }
          }
        }
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
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-5 sm:gap-x-4 sm:gap-y-2 md:gap-4 max-w-fit mx-auto">
          {data.map((month, monthIndex) => {
            const columns = chunkedDays(month.days, 7);

            return (
              <div key={monthIndex} className="flex flex-col">
                <div className="text-sm sm:text-sm font-medium mb-2 sm:mb-2">
                  {month.name}
                </div>
                <div className="flex gap-[4px] sm:gap-[3px]">
                  {columns.map((column, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex flex-col gap-[4px] sm:gap-[3px]">
                      {column.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`w-[12px] h-[12px] sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring-1 sm:hover:ring-2 hover:ring-offset-1 sm:hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
                            day.count
                          )}`}
                          title={`${day.date}: ${day.count} ${
                            day.count === 1 ? "activity" : "activities"
                          }`}
                          role="gridcell"
                          aria-label={`${day.date}: ${day.count} ${
                            day.count === 1 ? "activity" : "activities"
                          }`}
                        />
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
