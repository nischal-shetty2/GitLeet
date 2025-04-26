import React, { useMemo } from "react";
import { months } from "@/lib/calendarUtils";

export const MonthLabels = () => {
  const monthLabels = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);
    while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);

    const labels: { month: string; position: number }[] = [];
    let currentMonth = -1;

    for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + weekIndex * 7);
      const month = weekDate.getMonth();

      if (month !== currentMonth) {
        // Don't add an extra month label if we've looped back to the current month
        const isExtraCurrentMonthLabel =
          month === new Date().getMonth() &&
          labels.some((l) => l.month === months[month]);

        if (!isExtraCurrentMonthLabel) {
          labels.push({
            month: months[month],
            position: weekIndex,
          });
        }
        currentMonth = month;
      }
    }

    return labels;
  }, []);

  // Now we'll use percentages for positioning which will be more responsive
  return (
    <div className="flex mb-1 text-xs sm:text-sm text-gray-500 relative h-5 w-full">
      {monthLabels.map((label, i) => {
        // We have 53 weeks total, so calculate position as percentage
        const positionPercent = (label.position / 53) * 100;

        return (
          <div
            key={i}
            className="absolute whitespace-nowrap transform -translate-x-1/2"
            style={{ left: `${positionPercent}%` }}>
            <span className="hidden sm:inline">{label.month}</span>
            <span className="inline sm:hidden">
              {label.month.substring(0, 3)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
