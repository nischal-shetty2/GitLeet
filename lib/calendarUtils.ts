import { ActivityData } from "./types";

export const getStartDate = (
  daysBack: number,
  platform: "github" | "leetcode"
) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);

  // Align to platform's week start
  while (platform === "github" ? date.getDay() !== 0 : date.getDay() !== 1) {
    date.setDate(date.getDate() - 1);
  }

  return date;
};

export const generateEmptyCalendar = (
  startDate: Date,
  weeks: number,
  platform: "github" | "leetcode"
) => {
  const calendar: ActivityData[][] = [];
  const currentDate = new Date(startDate);

  for (let week = 0; week < weeks; week++) {
    const weekDays: ActivityData[] = [];

    for (let day = 0; day < 7; day++) {
      weekDays.push({
        date: currentDate.toISOString().split("T")[0],
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
