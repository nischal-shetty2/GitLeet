import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

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
    // Combine data from both sources
    const allActivities = [...(github.data || []), ...(leetcode.data || [])];
    const activityMap = new Map<string, number>();
    allActivities.forEach((activity) => {
      const dateStr = activity.date;
      const count = activity.count;
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + count);
    });
    const combined = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    if (platform === "github") {
      // GitHub weekly view logic using combined data
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);
      while (startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() - 1);
      }

      const endDate = new Date();
      const weeks: ActivityData[][] = Array(53)
        .fill(null)
        .map(() => []);

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const weekIndex = Math.floor(
          (currentDate.getTime() - startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );

        if (weekIndex < 53) {
          const dayOfWeek = currentDate.getDay();
          const dateStr = currentDate.toISOString().split("T")[0];
          weeks[weekIndex][dayOfWeek] = {
            date: dateStr,
            count: 0,
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Merge combined data into weeks
      combined.forEach((activity) => {
        const activityDate = new Date(activity.date);
        const weekIndex = Math.floor(
          (activityDate.getTime() - startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );
        if (weekIndex >= 0 && weekIndex < 53) {
          const dayOfWeek = activityDate.getDay();
          if (!weeks[weekIndex][dayOfWeek]) {
            weeks[weekIndex][dayOfWeek] = { date: activity.date, count: 0 };
          }
          weeks[weekIndex][dayOfWeek].count += activity.count;
        }
      });

      return { type: "github", weeks };
    } else {
      // FIXED LeetCode monthly view logic
      const months: { name: string; days: ActivityData[] }[] = [];
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get days in month using UTC
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthDays: ActivityData[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
          // Create date string in local format (YYYY-MM-DD)
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

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // Improved data merging with direct date parsing
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
          // Directly extract day from date string
          const day = parseInt(activity.date.split("-")[2], 10);
          const dayIndex = day - 1;
          if (months[monthIndex].days[dayIndex]) {
            months[monthIndex].days[dayIndex].count += activity.count;
          }
        }
      });

      return { type: "leetcode", months };
    }
  }, [platform, github.data, leetcode.data]);

  const getColorClass = (count: number) => {
    const baseColors = {
      github: [
        "bg-gray-100",
        "bg-lime-200",
        "bg-lime-300",
        "bg-lime-500",
        "bg-lime-700",
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
        "dark:bg-yellow-900",
        "dark:bg-yellow-700",
        "dark:bg-yellow-500",
        "dark:bg-yellow-300",
      ],
    };

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
    <div className="w-full overflow-x-auto">
      <div className="md:min-w-[750px] lg:min-w-[900px]">
        {data.type === "github" ? (
          // GitHub weekly view
          <div className="flex gap-1">
            {data.weeks?.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded transition-colors duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
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
          // LeetCode monthly view
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data.months?.map((month, monthIndex) => {
              const columnCount = Math.ceil(month.days.length / 7);
              const columns = chunkedDays(month.days, 7);

              return (
                <div key={monthIndex} className="flex flex-col">
                  <div className="text-sm font-medium mb-2">{month.name}</div>
                  <div className="flex gap-1">
                    {columns.map((column, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-1">
                        {column.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`w-3 h-3 rounded transition-colors duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
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
