"use client";

import { Label } from "@/components/ui/label";

export function Avatar({ username }: { username: string }) {
  return (
    <div className="flex items-center justify-center border rounded-md bg-accent h-21 w-21">
      <Label className="text-4xl font-semibold text-foreground">
        {username?.charAt(0).toUpperCase()}
      </Label>
    </div>
  );
}
