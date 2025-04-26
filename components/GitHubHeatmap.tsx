import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { MonthLabels } from "./MonthLabels";

export const GitHubHeatmap = ({
  github,
  leetcode,
}: {
  github: GitHubDataHook;
  leetcode: LeetCodeDataHook;
}) => {
  const data = useMemo(() => {
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

    // GitHub weekly view logic with improved date handling
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    // Ensure start date is the most recent Sunday
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const endDate = new Date();
    const weeks: ActivityData[][] = Array(53)
      .fill(null)
      .map(() =>
        Array(7)
          .fill(null)
          .map(() => ({ date: "", count: 0 }))
      );

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const weekIndex = Math.floor(
        (currentDate.getTime() - startDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

      if (weekIndex < 53) {
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

    // Merge combined data into weeks with robust date matching
    combined.forEach((activity) => {
      const activityDate = new Date(activity.date);
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
    });

    return weeks;
  }, [github.data, leetcode.data]);

  const getColorClass = (count: number) => {
    const baseColors = [
      "bg-gray-100",
      "bg-lime-200",
      "bg-lime-300",
      "bg-lime-500",
      "bg-lime-700",
    ];

    const darkColors = [
      "dark:bg-gray-800",
      "dark:bg-green-900",
      "dark:bg-green-700",
      "dark:bg-green-500",
      "dark:bg-green-300",
    ];

    const thresholds = [0, 1, 4, 7, 10];

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) {
        return `${baseColors[i]} ${darkColors[i]}`;
      }
    }
    return `${baseColors[0]} ${darkColors[0]}`;
  };

  return (
    <div className="flex flex-col">
      <MonthLabels />
      <div className="flex flex-nowrap gap-[2px] sm:gap-1 mx-auto">
        {data.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-3 md:h-3 rounded transition-colors duration-200 hover:ring-1 sm:hover:ring-2 hover:ring-offset-1 sm:hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 ${getColorClass(
                  day?.count || 0
                )}`}
                title={
                  day?.date ? `${day.date}: ${day.count} activities` : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubHeatmap;
