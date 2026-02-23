"use client";

import useSWR from "swr";
import Link from "next/link";

import { fetcher } from "@/lib/utils";
import { RecentProjectsDataTable } from "./recent-projects-data-table";
import { Card, CardContent } from "@/components/ui/card";

import {
  Users,
  Database,
  Activity,
  ExternalLink,
  Container,
  Projector,
  Boxes,
  Gauge,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  value?: any;
  label: string;
  Icon: LucideIcon;
  href?: string;
};

function StatCard({ value, label, Icon, href }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-6">
        {/* Icon */}
        <div className="bg-muted p-4 rounded-full">
          <Icon />
        </div>

        {/* Content */}
        <div>
          {href ? (
            <Link href={href} className="text-2xl font-semibold">
              {value}
            </Link>
          ) : (
            <p className="text-2xl font-semibold">{value ?? "-"}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

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
        />
      </div>

      <RecentProjectsDataTable data={projects} />
    </div>
  );
}
