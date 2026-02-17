"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

type RecentActivityCardProps = {
  data: any;
};

export function RecentActivityCard({ data }: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Registration Date</p>
          <p>{data.created_at}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Last Update</p>
          <p>{data.updated_at}</p>
        </div>
      </CardContent>
    </Card>
  );
}
