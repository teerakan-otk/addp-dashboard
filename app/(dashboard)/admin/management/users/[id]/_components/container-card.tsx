"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Box } from "lucide-react";

type ContainerData = {
  used: number;
  total: number;
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
  const total = data?.total ?? 0;

  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

  const status = getContainerStatus(percentage);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            <h2 className="font-semibold">Container Usage</h2>
          </div>

          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>In use</span>
            <span>
              {used} / {total}
            </span>
          </div>

          <Progress value={percentage} />
        </div>
      </CardContent>
    </Card>
  );
}
