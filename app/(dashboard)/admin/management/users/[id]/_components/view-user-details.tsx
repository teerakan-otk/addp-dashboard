"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserData } from "@/types/api";

import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Button } from "@/components/ui/button";
import { ContainerCard } from "./container-card";
import { DatabaseCard } from "./database-card";
import { ArrowLeft, Pencil, Shield } from "lucide-react";
import { TimestampCard } from "@/components/timestamp-card";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Props = {
  data: UserData;
};

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export function ViewUserDetails({ data }: Props) {
  const router = useRouter();

  const formattedRole =
    data.role?.charAt(0).toUpperCase() + data.role?.slice(1).toLowerCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">View User</h1>
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
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ContainerCard data={data.containers} />
        <DatabaseCard data={data.database} />
      </div>

      <TimestampCard createdAt={data.created_at} updatedAt={data.updated_at} />

      <Button asChild>
        <Link href="/admin/management/users">
          <ArrowLeft />
          Go Back
        </Link>
      </Button>
    </div>
  );
}
