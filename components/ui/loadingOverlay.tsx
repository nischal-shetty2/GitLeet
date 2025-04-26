import React from "react";
import { Skeleton } from "./skeleton";

export const LoadingOverlay = () => {
  const weeks = Array(53).fill(null);
  const days = Array(7).fill(null);
  return (
    <div className="w-full h-full flex justify-center items-center overflow-x-auto">
      <div className="md:min-w-[750px] lg:min-w-[900px]">
        <div className="flex gap-1">
          {weeks.map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {days.map((__, dayIndex) => (
                <Skeleton key={dayIndex} className="w-3 h-3 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
