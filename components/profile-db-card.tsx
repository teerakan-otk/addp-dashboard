"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {
  database: number;
};

export function ProfileDBCard({ database }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span>Database</span>
          </div>
          <Badge variant="secondary">Status</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status */}
        <div className="flex items-center justify-center">
          <p
            className={cn(
              "text-4xl font-semibold",
              database === 2
                ? "text-emerald-500"
                : database === 1
                  ? "text-yellow-500"
                  : "text-destructive",
            )}
          >
            {database === 2
              ? "Connected"
              : database === 1
                ? "Request"
                : "Not connected"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
