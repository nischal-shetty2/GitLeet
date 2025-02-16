import { ActivityData, GitHubJsonData, LeetCodeJsonData } from "./types";

export const transformGitHubData = (
  jsonData: GitHubJsonData
): ActivityData[] => {
  if (jsonData.errors) {
    throw new Error(jsonData.errors[0].message);
  }

  if (
    !jsonData?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
  ) {
    throw new Error("Invalid GitHub data");
  }

  try {
    // Flatten the weeks and map contribution days
    return jsonData.data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week: any) => week.contributionDays || []) // Handle missing contributionDays
      .map((day: any) => ({
        date: day.date,
        count: day.contributionCount || 0, // Default to 0 if contributionCount is missing
      }));
  } catch (error) {
    console.error("Error transforming GitHub data:", error);
    return [];
  }
};

export const transformLeetCodeData = (
  jsonData: LeetCodeJsonData
): ActivityData[] => {
  // Validate the input structure
  if (!jsonData?.data?.matchedUser?.submissionCalendar) {
    throw new Error("Invalid Leetcode");
  }

  try {
    // Parse the submission calendar
    const rawCalendar = JSON.parse(
      jsonData.data.matchedUser.submissionCalendar
    );

    // Transform the data
    return Object.entries(rawCalendar).map(([timestamp, count]) => ({
      date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0], // Convert timestamp to YYYY-MM-DD
      count: Number(count) || 0, // Ensure count is a number, default to 0 if invalid
    }));
  } catch (error) {
    console.error("Error transforming LeetCode data:", error);
    return [];
  }
};
