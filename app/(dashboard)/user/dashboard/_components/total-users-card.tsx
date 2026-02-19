"use client";

import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TotalUsersCard({ meta }: { meta: any }) {
  const totalUsers = meta?.statistics?.totalUsers ?? 0;

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="bg-muted p-4 rounded-full">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <p className="text-3xl font-semibold">{totalUsers}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>
      </CardContent>
    </Card>
  );
}
