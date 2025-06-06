"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTooltip,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AdaptiveTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export function AdaptiveTooltip({
  children,
  content,
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
}: AdaptiveTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle delayed opening for mobile popovers
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && isMobile) {
      // Add a small delay before opening on mobile, similar to tooltip behavior
      setTimeout(() => setOpen(true), 100);
    } else {
      setOpen(newOpen);
    }
  };

  // Use Popover for mobile and Tooltip for desktop
  if (isMobile) {
    // For mobile devices, add a tap handler to close on tap after a short delay
    const handleTouchStart = () => {
      // Auto close popover after a tap (with slight delay for better UX)
      if (open) {
        setTimeout(() => setOpen(false), 500);
      }
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverTooltip
          onTouchStart={handleTouchStart}
          className={className}
          align={align}
          side={side}
          sideOffset={sideOffset}>
          {content}
        </PopoverTooltip>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={className}
          side={side}
          sideOffset={sideOffset}
          align={align}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
