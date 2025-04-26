import { ActivityData, GitHubJsonData, LeetCodeJsonData } from "./types";

export const transformGitHubData = (
  jsonData: GitHubJsonData
): ActivityData[] => {
  if (jsonData.errors) {
    throw new Error(jsonData.errors[0].message);
  }

  const data =
    jsonData?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

  if (!data) {
    throw new Error("Invalid GitHub data");
  }
  try {
    // Flatten the weeks and map contribution days
    const response = data
      .flatMap((week) => week.contributionDays || [])
      .map((day) => ({
        date: day.date,
        count: day.contributionCount || 0,
      }));

    return response;
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
