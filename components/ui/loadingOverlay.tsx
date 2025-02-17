import { Skeleton } from "./skeleton";

export const LoadingOverlay = () => (
  <div className="flex gap-1">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
);
