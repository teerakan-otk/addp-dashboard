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
  containers: {
    used: number;
    max: number;
  };
};

export function ProfileContainersCard({ containers }: Props) {
  const percentage =
    containers?.max > 0
      ? Math.round((containers?.used / containers?.max) * 100)
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
            {containers?.used} / {containers?.max}
          </span>
        </div>

        <Progress value={percentage} />
      </CardContent>
    </Card>
  );
}
