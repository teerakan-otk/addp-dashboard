"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AvatarProps = {
  username: string;
  className?: string;
};

export function Avatar({ username, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border rounded-md bg-accent h-21 w-21",
        className,
      )}
    >
      <Label className="text-4xl font-semibold text-foreground">
        {username?.charAt(0).toUpperCase()}
      </Label>
    </div>
  );
}
