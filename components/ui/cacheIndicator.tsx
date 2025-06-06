import { AlertCircle } from "lucide-react";

interface CacheIndicatorProps {
  isFromCache: boolean;
}

export const CacheIndicator = ({ isFromCache }: CacheIndicatorProps) => {
  if (!isFromCache) return null;

  return (
    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs px-2 py-1 rounded bg-yellow-50 dark:bg-yellow-900/30">
      <AlertCircle size={12} />
      <span>Cached data</span>
    </div>
  );
};
