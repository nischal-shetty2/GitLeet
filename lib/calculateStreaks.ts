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

  // Create a set of days with activity for faster lookup
  const activeDays = new Set<string>();
  filteredActivities.forEach(({ date, count }) => {
    if (count > 0) {
      activeDays.add(date);
    }
  });

  // Calculate current streak correctly
  let currentStreak = 0;
  let currentDate = new Date(today);
  
  // If today has no activity, check if yesterday had activity
  // (to handle case where user hasn't done anything today yet)
  const todayStr = currentDate.toISOString().split("T")[0];
  if (!activeDays.has(todayStr)) {
    currentDate.setDate(currentDate.getDate() - 1);
    const yesterdayStr = currentDate.toISOString().split("T")[0];
    if (!activeDays.has(yesterdayStr)) {
      // If neither today nor yesterday has activity, streak is 0
      currentStreak = 0;
    } else {
      // Start counting from yesterday
      while (currentDate >= startOfYear) {
        const dateStr = currentDate.toISOString().split("T")[0];
        if (activeDays.has(dateStr)) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  } else {
    // Today has activity, start counting from today
    while (currentDate >= startOfYear) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (activeDays.has(dateStr)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = currentStreak > 0 ? currentStreak : 0;
  
  // Find all continuous streaks in the year
  let streak = 0;
  let lastActiveDay: Date | null = null;

  filteredActivities.forEach(({ date, count }) => {
    if (count > 0) {
      const activityDate = new Date(date);
      
      if (lastActiveDay === null) {
        // First day with activity
        streak = 1;
      } else {
        // Check if this activity is consecutive with the last one
        const dayDiff = Math.floor(
          (activityDate.getTime() - lastActiveDay.getTime()) / (24 * 60 * 60 * 1000)
        );
        
        if (dayDiff === 1) {
          // Consecutive day
          streak++;
        } else if (dayDiff > 1) {
          // Break in the streak
          longestStreak = Math.max(longestStreak, streak);
          streak = 1;
        }
        // dayDiff should never be 0 as we've merged activities by date
      }
      
      lastActiveDay = activityDate;
      longestStreak = Math.max(longestStreak, streak);
    }
  });

  // Calculate total contributions and best day
  let totalContributions = 0;
  let bestDay = { date: "", count: 0 };
  filteredActivities.forEach(({ date, count }) => {
    totalContributions += count;
    if (count > bestDay.count) {
      bestDay = { date, count };
    }
  });

  const averagePerDay = filteredActivities.length > 0 
    ? totalContributions / filteredActivities.length 
    : 0;

  return {
    currentStreak,
    longestStreak,
    totalContributions,
    averagePerDay,
    bestDay,
  };
};
