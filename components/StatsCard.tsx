import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const StatsCard = ({
  title,
  value,
  helpText,
}: {
  title: string;
  value: string | number;
  helpText?: string;
}) => (
  <Card>
    <CardHeader>
      <div className=" flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={15} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
