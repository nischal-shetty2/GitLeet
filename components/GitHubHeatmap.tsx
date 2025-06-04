import React, { useMemo } from "react";
import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { MonthLabels } from "./MonthLabels";
import { formatDateString, normalizeDate } from "@/lib/calendarUtils";

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

    const combined = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

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

    const weeks: ActivityData[][] = Array(totalWeeks)
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

      if (weekIndex >= 0 && weekIndex < totalWeeks) {
        const dayOfWeek = currentDate.getDay();

        // Use utility function for consistent date formatting
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

    // Merge combined data into weeks with robust date matching
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

    return weeks;
  }, [github.data, leetcode.data]);

  const getColorClass = (count: number) => {
    const baseColors = [
      "bg-gray-100",
      "bg-green-200",
      "bg-green-300",
      "bg-green-500",
      "bg-green-700",
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
