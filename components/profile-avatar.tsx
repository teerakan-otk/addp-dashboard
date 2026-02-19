"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  username: string;
  className?: string;
};

export function ProfileAvatar({ username, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-24 w-24 items-center justify-center bg-muted",
        className,
      )}
    >
      <Label className="text-4xl font-semibold text-foreground">
        {username?.charAt(0).toUpperCase()}
      </Label>
    </div>
  );
}
