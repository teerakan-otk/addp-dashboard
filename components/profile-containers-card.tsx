"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Box } from "lucide-react";

type Props = {
  data: any;
};

export function ProfileContainersCard({ data }: Props) {
  const percentage =
    data.containers?.total > 0
      ? Math.round((data.containers?.used / data.containers?.total) * 100)
      : 0;

  const status =
    percentage >= 90
      ? "destructive"
      : percentage >= 70
        ? "secondary"
        : "default";

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          <CardTitle>Containers</CardTitle>
        </div>
        <Badge variant={status}>
          {percentage >= 100 ? "Limit Reached" : "Available"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>In use</span>
          <span>
            {data.containers?.used} / {data.containers?.total}
          </span>
        </div>

        <Progress value={percentage} />
      </CardContent>
    </Card>
  );
}
