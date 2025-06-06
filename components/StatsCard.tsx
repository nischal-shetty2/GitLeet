import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AdaptiveTooltip } from "@/components/ui/adaptive-tooltip";

export const StatsCard = ({
  title,
  value,
  helpText,
}: {
  title: string;
  value: string | number;
  helpText?: string;
}) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
    <CardHeader className="bg-gradient-to-r from-background to-muted/20 pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-base font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {helpText && (
          <AdaptiveTooltip content={<p>{helpText}</p>} className="max-w-xs">
            <button
              className="rounded-full p-1 hover:bg-muted transition-colors"
              aria-label={`Info about ${title}`}>
              <InfoIcon size={14} className="text-muted-foreground" />
            </button>
          </AdaptiveTooltip>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
        {value}
      </div>
    </CardContent>
  </Card>
);
