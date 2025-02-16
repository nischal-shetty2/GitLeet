import { ActivityData } from "./types";

export const calculateStreaks = (activities: ActivityData[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfYear = new Date(today.getFullYear() - 1, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);

  // Merge activities by date
  const activityMap = new Map<string, number>();
  activities.forEach(({ date, count }) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    activityMap.set(
      formattedDate,
      (activityMap.get(formattedDate) || 0) + count
    );
  });

  // Filter activities for the current year
  const filteredActivities = Array.from(activityMap.entries())
    .map(([date, count]) => ({ date, count }))
    .filter(({ date }) => {
      const activityDate = new Date(date);
      return activityDate >= startOfYear && activityDate <= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate current streak
  let currentStreak = 0;
  let currentDate = new Date(today);
  while (currentDate >= startOfYear) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (activityMap.has(dateStr) && activityMap.get(dateStr)! > 0) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let streak = 0;
  currentDate = new Date(today);
  while (currentDate >= startOfYear) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (activityMap.has(dateStr) && activityMap.get(dateStr)! > 0) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Calculate total contributions and best day
  let totalContributions = 0;
  let bestDay = { date: "", count: 0 };
  filteredActivities.forEach(({ date, count }) => {
    totalContributions += count;
    if (count > bestDay.count) {
      bestDay = { date, count };
    }
  });

  const averagePerDay = totalContributions / filteredActivities.length || 0;

  return {
    currentStreak,
    longestStreak,
    totalContributions,
    averagePerDay,
    bestDay,
  };
};
