import React from "react";
import { Skeleton } from "./skeleton";

export const LoadingOverlay = () => {
  // Create 12 months for the heatmap (matching LeetCodeHeatmap structure)
  const months = Array(12).fill(null);

  // Each month typically has around 30 days, which we'll organize in columns of 7 days
  const daysPerMonth = 30;
  const columnsPerMonth = 5; // ~30 days / 7 = ~4-5 columns

  return (
    <div className="w-full overflow-x-auto pb-3">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-3 md:gap-4 max-w-fit mx-auto">
          {months.map((_, monthIndex) => (
            <div key={monthIndex} className="flex flex-col">
              {/* Month name placeholder */}
              <div className="text-sm sm:text-sm font-medium mb-2 sm:mb-2">
                <Skeleton className="h-4 w-12 rounded" />
              </div>
              <div className="flex gap-[4px] p-1 sm:gap-[3px]">
                {Array(columnsPerMonth)
                  .fill(null)
                  .map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex flex-col gap-[4px] sm:gap-[3px]">
                      {/* Create 7 days per column */}
                      {Array(7)
                        .fill(null)
                        .map((__, dayIndex) => (
                          <Skeleton
                            key={dayIndex}
                            className="w-[12px] h-[12px] sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded animate-pulse"
                            style={{
                              opacity: 0.2 + Math.random() * 0.7,
                              animationDelay: `${
                                (monthIndex * columnsPerMonth * 7 +
                                  colIndex * 7 +
                                  dayIndex) *
                                10
                              }ms`,
                              animationDuration: `${
                                800 + Math.floor(Math.random() * 600)
                              }ms`,
                            }}
                          />
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
