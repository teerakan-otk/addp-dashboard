"use client";

import useSWR from "swr";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/api";

import { RecentProjectsDataTable } from "./recent-projects-data-table";
import { StatCard } from "@/components/stat-card";
import { Database, Gauge, Briefcase } from "lucide-react";

export function AdminDashboard() {
  const { data, isLoading } = useSWR("/api/stats", fetcher);

  if (isLoading) return null;

  const projects = data?.containers ?? [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          value={data.user?.containers?.used ?? 0}
          label="Active Projects"
          Icon={Briefcase}
        />
        <StatCard
          value={data.user?.containers?.max ?? 0}
          label="Remaining Quota"
          Icon={Gauge}
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

      <RecentProjectsDataTable data={projects} />
    </div>
  );
}
