"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Box } from "lucide-react";

type ContainerCardProps = {
  data: any;
};

export function ContainerCard({ data }: ContainerCardProps) {
  const percentage =
    data.total > 0 ? Math.round((data.used / data.total) * 100) : 0;

  const status =
    percentage >= 90
      ? "destructive"
      : percentage >= 70
        ? "secondary"
        : "outline";
  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            <h1 className="font-semibold">Containers Usage</h1>
          </div>
          <Badge variant={status}>
            {percentage >= 100 ? "Limit Reached" : "Available"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>In use</span>
            <span>
              {data.used} / {data.total}
            </span>
          </div>

          <Progress value={percentage} />
        </div>
      </CardContent>
    </Card>
  );
}
