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

  const statistics = data?.users ?? [];
  const projects = data?.containers ?? [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          value={statistics?.total_users}
          label="Total Users"
          Icon={Users}
        />
        <StatCard
          value={statistics?.total_req_db}
          label="Request DB Access"
          Icon={Inbox}
        />
        <StatCard
          value={
            data.profile === 2
              ? "Connected"
              : data.profile === 1
                ? "Pending"
                : "Disconnected"
          }
          label="Database Status"
          Icon={Database}
          className={cn(
            data.profile === 2
              ? "text-green-500"
              : data.profile === 1
                ? "text-yellow-500"
                : "text-destructive",
          )}
        />
      </div>

      <RecentProjectsDataTable data={projects} />
    </div>
  );
}
