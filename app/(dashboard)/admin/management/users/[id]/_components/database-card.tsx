"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, Database } from "lucide-react";

function getDatabaseStatus(data?: number) {
  if (!data) {
    return { label: "Not connected", color: "red" };
  }

  if (data === 2) {
    return { label: "Connected", color: "green" };
  }

  if (data === 1) {
    return { label: "Pending Approval", color: "yellow" };
  }

  return { label: "Not connected", color: "red" };
}

export function DatabaseCard({ data }: { data?: number }) {
  const status = getDatabaseStatus(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Instance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <span>Status</span>

          <Badge variant="outline" className="flex items-center gap-2">
            <Circle size={8} fill={status.color} strokeWidth={0} />
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
