import { ActivityData, GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { useMemo } from "react";

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
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);
    while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);

    const endDate = new Date();
    const weeks: ActivityData[][] = Array(53)
      .fill(null)
      .map(() => []);

    // Initialize all dates
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

    // Merge actual data
    const allActivities = [...github.data!, ...leetcode.data!];
    allActivities.forEach((activity) => {
      const activityDate = new Date(activity.date);
      const weekIndex = Math.floor(
        (activityDate.getTime() - startDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

      if (weekIndex >= 0 && weekIndex < 53) {
        const dayOfWeek = activityDate.getDay();
        if (weeks[weekIndex][dayOfWeek]) {
          weeks[weekIndex][dayOfWeek].count += activity.count;
        }
      }
    });

    return weeks;
  }, [github.data, leetcode.data]);

  const getColorClass = (count: number) => {
    const baseColors = {
      github: [
        "bg-gray-100",
        "bg-lime-100",
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
    // const platformIndex = platform === "github" ? 0 : 1;

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) {
        return `${baseColors[platform][i]} ${darkColors[platform][i]}`;
      }
    }
    return `${baseColors[platform][0]} ${darkColors[platform][0]}`;
  };

  return (
    <div className="flex gap-1">
      {data.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`w-3 h-3 rounded ${getColorClass(day?.count || 0)}`}
              title={
                day?.date ? `${day.date}: ${day.count} activities` : undefined
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};
