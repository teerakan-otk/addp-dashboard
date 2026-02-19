"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/profile-avatar";
import { ContainerCard } from "./container-card";
import { Button } from "@/components/ui/button";
import { DatabaseCard } from "./database-card";
import { RecentActivityCard } from "./recent-activity-card";
import { ArrowLeft, Circle, Pencil, Shield, User2 } from "lucide-react";

type ViewDetailsProps = {
  data: any;
};

export function ViewDetails({ data }: ViewDetailsProps) {
  const formattedRole =
    data.role?.charAt(0).toUpperCase() + data.role?.slice(1).toLowerCase();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div>
        <Link
          href="/admin/management/users"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-row items-center gap-4">
        <ProfileAvatar username={data.username || ""} />
        <div className="flex flex-1">
          {/* Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm">ID: {data.id}</p>
              <Badge variant="secondary">
                <Shield />
                {formattedRole}
              </Badge>
            </div>
            <p className="text-sm">Username: {data.username || ""}</p>
            <p className="text-sm">Email: {data.email || ""}</p>
          </div>

          {/* Action */}
          <div className="ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ContainerCard data={data.containers || []} />
        <DatabaseCard data={data.database || []} />
      </div>
      <RecentActivityCard data={data} />
    </div>
  );
}
