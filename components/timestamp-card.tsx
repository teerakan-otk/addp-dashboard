"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

type Props = {
  icon?: boolean;
  createdAt: string;
  updatedAt: string;
};

export function TimestampCard({ icon = false, createdAt, updatedAt }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon ? <History /> : undefined}
          Timestamp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>Created at: {createdAt}</p>
        <p>Last updated: {updatedAt}</p>
      </CardContent>
    </Card>
  );
}
