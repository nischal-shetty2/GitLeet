import { Skeleton } from "./skeleton";

export const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
    <div className="space-y-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);
