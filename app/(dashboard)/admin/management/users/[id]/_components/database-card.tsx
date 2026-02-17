"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, Database } from "lucide-react";

type DatabaseCardProps = {
  data: any;
};

export function DatabaseCard({ data }: DatabaseCardProps) {
  const status =
    data.connected == true && data.request == false
      ? "Connected"
      : data.connected == false && data.request == true
        ? "Request"
        : "Not connected";

  const color =
    status === "Connected" ? "green" : status === "Request" ? "yellow" : "red";

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <h1 className="font-semibold">Database Instance</h1>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <p>Status</p>

          <Badge variant="outline">
            <Circle size={8} fill={color} strokeWidth={0} />
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
