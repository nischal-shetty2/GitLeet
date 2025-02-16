import { months } from "@/lib/calendarUtils";
import { useMemo } from "react";

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
        labels.push({
          month: months[month],
          position: weekIndex,
        });
        currentMonth = month;
      }
    }

    return labels;
  }, []);

  return (
    <div className="flex mb-1 text-sm text-gray-500">
      {monthLabels.map((label, i) => (
        <div
          key={i}
          className="text-xs"
          style={{
            marginLeft:
              i === 0
                ? 0
                : `${
                    (label.position - monthLabels[i - 1]?.position + 0.3) * 10
                  }px`,
          }}>
          {label.month}
        </div>
      ))}
    </div>
  );
};
