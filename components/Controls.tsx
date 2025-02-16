import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";

interface ControlsProps {
  platform: string;
  setPlatform: (platform: "github" | "leetcode") => void;
  timeRange: number;
  setTimeRange: (timeRange: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  platform,
  setPlatform,
  timeRange,
  setTimeRange,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Platform Style:</span>
            <div className="flex items-center gap-2">
              <span>GitHub</span>
              <Switch
                checked={platform === "leetcode"}
                onCheckedChange={(checked) =>
                  setPlatform(checked ? "leetcode" : "github")
                }
              />
              <span>LeetCode</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            <select
              className="p-2 rounded border bg-background"
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear - 2}>{currentYear - 2}</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
