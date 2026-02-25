"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Box } from "lucide-react";

type ContainerData = {
  used: number;
  max: number;
};

function getContainerStatus(percentage: number) {
  if (percentage >= 100) {
    return { label: "Limit Reached", variant: "destructive" as const };
  }

  if (percentage >= 70) {
    return { label: "Almost Full", variant: "secondary" as const };
  }

  return { label: "Available", variant: "outline" as const };
}

export function ContainerCard({ data }: { data?: ContainerData }) {
  const used = data?.used ?? 0;
  const max = data?.max ?? 0;

  const percentage = max > 0 ? Math.round((used / max) * 100) : 0;

  const status = getContainerStatus(percentage);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          Container Usage
        </CardTitle>
        <Badge variant={status.variant}>{status.label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>In use</span>
            <span>
              {used} / {max}
            </span>
          </div>

          <Progress value={percentage} />
        </div>
      </CardContent>
    </Card>
  );
}
