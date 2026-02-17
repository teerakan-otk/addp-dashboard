"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

type DynamicTooltipProps = {
  iconSize?: number | string;
  children: ReactNode;
  className?: string;
  title: string;
};

export function DynamicTooltip({
  iconSize = 18,
  children,
  className,
  title,
}: DynamicTooltipProps) {
  const isMobile = useIsMobile();

  const TriggerIcon = <Info size={iconSize} />;

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" aria-label={title}>
            {TriggerIcon}
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <p>{children}</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span aria-label={title}>{TriggerIcon}</span>
      </TooltipTrigger>
      <TooltipContent className={className} side="top">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
