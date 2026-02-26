"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";

import { RecentProjectsDataTable } from "./recent-projects-data-table";
import { Users, Database, Inbox } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const { data, isLoading } = useSWR("/api/stats", fetcher);

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          value={data.meta?.total_users ?? []}
          label="Total Users"
          Icon={Users}
        />
        <StatCard
          value={data.meta?.total_req_db ?? []}
          label="Request DB Access"
          Icon={Inbox}
        />
        <StatCard
          value={
            data.user?.database === 2
              ? "Connected"
              : data.user?.database === 1
                ? "Pending"
                : "Disconnected"
          }
          label="Database Status"
          Icon={Database}
          className={cn(
            data.user?.database === 2
              ? "text-green-500"
              : data.user?.database === 1
                ? "text-yellow-500"
                : "text-destructive",
          )}
        />
      </div>

      <RecentProjectsDataTable data={data.containers ?? []} />
    </div>
  );
}
