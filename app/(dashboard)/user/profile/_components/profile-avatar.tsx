"use client";

import { cn } from "@/lib/utils";

export function ProfileAvatar({
  username,
  className,
}: {
  username: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-24 w-24 items-center justify-center bg-muted",
        className,
      )}
    >
      <span className="text-4xl">{username.charAt(0).toUpperCase()}</span>
    </div>
  );
}
