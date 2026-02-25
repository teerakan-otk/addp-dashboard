"use client";

import { ProfileAvatar } from "@/components/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

type Props = {
  data: any;
};

export function UserInfo({ data }: Props) {
  const formattedRole =
    data.role?.charAt(0).toUpperCase() + data.role?.slice(1).toLowerCase();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>User Overview</CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {formattedRole}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-row gap-6">
        <ProfileAvatar username={data.username} className="h-20 w-20" />
        <div className="flex flex-1 items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm">ID: {data.id}</p>
            </div>

            <p className="text-sm">Username: {data.username}</p>
            <p className="text-sm">Email: {data.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
