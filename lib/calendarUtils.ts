import { ActivityData } from "./types";

/**
 * Formats a date to YYYY-MM-DD string consistently
 * @param date Date object or string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateString = (date: Date | string): string => {
  // If already in YYYY-MM-DD format, return as is
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Convert to Date object if string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validate date
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  // Format consistently
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Safely parses a date string into a normalized YYYY-MM-DD format
 * @param dateStr Date string in any format
 * @returns Formatted date string or empty string if invalid
 */
export const normalizeDate = (dateStr: string): string => {
  try {
    if (!dateStr) return "";

    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "";
    }

    return formatDateString(date);
  } catch (err) {
    console.error("Error normalizing date:", err);
    return "";
  }
};

export const getStartDate = (
  daysBack: number,
  platform: "github" | "leetcode"
) => {
  const now = new Date();
  const date = new Date(now);
  date.setDate(date.getDate() - daysBack);

  // Normalize time to start of day to avoid timezone issues
  date.setHours(0, 0, 0, 0);

  // Align to platform's week start (Sunday for GitHub, Monday for LeetCode)
  while (platform === "github" ? date.getDay() !== 0 : date.getDay() !== 1) {
    date.setDate(date.getDate() - 1);
  }

  return date;
};

export const generateEmptyCalendar = (startDate: Date, weeks: number) => {
  const calendar: ActivityData[][] = [];
  const currentDate = new Date(startDate);

  // Normalize time to start of day to avoid timezone issues
  currentDate.setHours(0, 0, 0, 0);

  for (let week = 0; week < weeks; week++) {
    const weekDays: ActivityData[] = [];

    for (let day = 0; day < 7; day++) {
      weekDays.push({
        date: formatDateString(currentDate),
        count: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    calendar.push(weekDays);
  }

  return calendar;
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
