"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Box } from "lucide-react";

export function Container({ containers }: { containers: any }) {
  const percentage =
    containers?.total > 0
      ? Math.round((containers?.used / containers?.total) * 100)
      : 0;

  const status =
    percentage >= 90
      ? "destructive"
      : percentage >= 70
        ? "secondary"
        : "outline";
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          <h1>Containers</h1>
        </div>
        <Badge variant={status}>
          {percentage >= 100 ? "Limit Reached" : "Available"}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>In use</span>
          <span>
            {containers?.used} / {containers?.total}
          </span>
        </div>

        <Progress value={percentage} />
      </div>
    </div>
  );
}
