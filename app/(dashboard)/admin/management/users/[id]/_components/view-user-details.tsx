"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerCard } from "./container-card";
import {
  ArrowLeft,
  Box,
  Circle,
  Clock,
  Database,
  Pencil,
  Shield,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type ContainerData = {
  used: number;
  max: number;
};

type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  containers?: ContainerData;
  database?: number;
};

type Props = {
  data: UserData;
};

/* -------------------------------------------------------------------------- */
/*                                Helper Logic                                */
/* -------------------------------------------------------------------------- */

function getDatabaseStatus(data?: number) {
  if (!data) {
    return { label: "Not connected", color: "red" };
  }

  if (data === 2) {
    return { label: "Connected", color: "green" };
  }

  if (data === 1) {
    return { label: "Pending Request", color: "yellow" };
  }

  return { label: "Not connected", color: "red" };
}

/* -------------------------------------------------------------------------- */
/*                               Database Card                                */
/* -------------------------------------------------------------------------- */

function DatabaseCard({ data }: { data?: number }) {
  const status = getDatabaseStatus(data);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <h2 className="font-semibold">Database Instance</h2>
        </div>

        <div className="flex justify-between text-sm">
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

/* -------------------------------------------------------------------------- */
/*                           Recent Activity Card                             */
/* -------------------------------------------------------------------------- */

function RecentActivityCard({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Registration Date</p>
          <p>{createdAt}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Last Update</p>
          <p>{updatedAt}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export function ViewUserDetails({ data }: Props) {
  const router = useRouter();

  const formattedRole =
    data.role?.charAt(0).toUpperCase() + data.role?.slice(1).toLowerCase();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link
        href="/admin/management/users"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <ProfileAvatar username={data.username ?? ""} />

        <div className="flex flex-1 items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm">ID: {data.id}</p>

              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {formattedRole}
              </Badge>
            </div>

            <p className="text-sm">Username: {data.username}</p>
            <p className="text-sm">Email: {data.email}</p>
          </div>

          <div className="ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() =>
                router.push(`/admin/management/users/${data.id}/edit`)
              }
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ContainerCard data={data.containers} />
        <DatabaseCard data={data.database} />
      </div>

      <RecentActivityCard
        createdAt={data.created_at}
        updatedAt={data.updated_at}
      />
    </div>
  );
}
