import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import { Github } from "lucide-react";
import { LeetcodeLogo } from "./ui/logo";

interface ControlsProps {
  platform: string;
  setPlatform: (platform: "github" | "leetcode") => void;
}

export const Controls: React.FC<ControlsProps> = ({
  platform,
  setPlatform,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="py-6 px-6 bg-gradient-to-r from-background to-muted/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-3">Platform Style:</span>
              <div className="flex items-center gap-3 border rounded-full px-3 py-1.5 bg-background/80">
                <div
                  className={`flex items-center gap-1.5 ${
                    platform !== "leetcode"
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}>
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full ml-1">
                    BETA
                  </span>
                </div>

                <Switch
                  checked={platform === "leetcode"}
                  onCheckedChange={(checked) => {
                    // Only allow switching to LeetCode, not back to GitHub
                    if (checked) setPlatform("leetcode");
                  }}
                  disabled={true}
                  className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-gray-500"
                />

                <div
                  className={`flex items-center gap-1.5 ${
                    platform === "leetcode"
                      ? "text-yellow-500 font-medium"
                      : "text-muted-foreground"
                  }`}>
                  <div className="w-4 h-4">
                    <LeetcodeLogo />
                  </div>
                  <span>LeetCode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
