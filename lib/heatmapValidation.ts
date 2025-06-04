import { ActivityData } from "./types";
import { normalizeDate } from "./calendarUtils";

/**
 * Validates activity data for multiple platforms and checks for date inconsistencies
 * This function can be used in development to identify data issues
 */
export const validateHeatmapData = (
  githubData: ActivityData[],
  leetcodeData: ActivityData[]
): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check for missing or invalid dates
  const checkDates = (activities: ActivityData[], source: string) => {
    activities.forEach((activity, index) => {
      try {
        if (!activity.date) {
          issues.push(`${source} activity at index ${index} has no date`);
          return;
        }

        // Try to normalize the date
        const normalized = normalizeDate(activity.date);
        if (!normalized) {
          issues.push(
            `${source} activity at index ${index} has invalid date: ${activity.date}`
          );
        } else if (normalized !== activity.date) {
          // The date needed normalization - not necessarily an error but good to know
          issues.push(
            `${source} activity at index ${index}: date ${activity.date} normalized to ${normalized}`
          );
        }
      } catch (err) {
        issues.push(`${source} activity at index ${index}: ${err}`);
      }
    });
  };

  // Check for duplicate dates with different counts
  const checkDuplicates = (activities: ActivityData[], source: string) => {
    const dateMap = new Map<string, number[]>();

    activities.forEach((activity) => {
      if (!activity.date) return;

      const normalized = normalizeDate(activity.date);
      if (!normalized) return;

      if (!dateMap.has(normalized)) {
        dateMap.set(normalized, []);
      }
      dateMap.get(normalized)?.push(activity.count);
    });

    // Check for dates with multiple different counts
    dateMap.forEach((counts, date) => {
      if (counts.length > 1) {
        const unique = new Set(counts);
        if (unique.size > 1) {
          issues.push(
            `${source} has multiple different counts for date ${date}: ${counts.join(
              ", "
            )}`
          );
        }
      }
    });
  };

  // Check for inconsistencies between platforms
  const checkCrossPlatform = () => {
    const githubDates = new Map<string, number>();
    const leetcodeDates = new Map<string, number>();

    githubData.forEach((activity) => {
      const normalized = normalizeDate(activity.date);
      if (normalized) {
        githubDates.set(normalized, activity.count);
      }
    });

    leetcodeData.forEach((activity) => {
      const normalized = normalizeDate(activity.date);
      if (normalized) {
        leetcodeDates.set(normalized, activity.count);
      }
    });

    // Check dates that appear in both platforms
    const commonDates = new Set(
      [...githubDates.keys()].filter((date) => leetcodeDates.has(date))
    );
    commonDates.forEach((date) => {
      const githubCount = githubDates.get(date) || 0;
      const leetcodeCount = leetcodeDates.get(date) || 0;

      // Just providing this info can be useful for validation
      issues.push(
        `Date ${date}: GitHub count=${githubCount}, LeetCode count=${leetcodeCount}, Combined=${
          githubCount + leetcodeCount
        }`
      );
    });
  };

  // Run all checks
  checkDates(githubData, "GitHub");
  checkDates(leetcodeData, "LeetCode");
  checkDuplicates(githubData, "GitHub");
  checkDuplicates(leetcodeData, "LeetCode");
  checkCrossPlatform();

  return {
    valid: issues.filter((issue) => !issue.includes("Combined=")).length === 0,
    issues,
  };
};

/**
 * Debug function to log the first missing days in a heatmap grid
 * Useful to identify where the blank spots are coming from
 */
export const findMissingDays = (grid: ActivityData[][]): string[] => {
  const missing: string[] = [];

  // Check for empty date strings
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell.date) {
        missing.push(`Empty date at row ${rowIndex}, column ${colIndex}`);
      }
    });
  });

  return missing;
};
