import React from "react";
import { Skeleton } from "./skeleton";

export const LoadingOverlay = () => {
  const weeks = Array(53).fill(null);
  const days = Array(7).fill(null);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-x-auto py-4">
      <div className="md:min-w-[750px] lg:min-w-[900px]">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <Skeleton className="h-6 w-40 mx-auto rounded" />
          </div>

          <div className="flex gap-1">
            {weeks.map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {days.map((__, dayIndex) => (
                  <Skeleton
                    key={dayIndex}
                    className={`w-3 h-3 rounded opacity-${
                      Math.floor(Math.random() * 80) + 20
                    } animate-pulse`}
                    style={{
                      animationDelay: `${(weekIndex * 7 + dayIndex) * 10}ms`,
                      animationDuration: `${
                        800 + Math.floor(Math.random() * 1200)
                      }ms`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
