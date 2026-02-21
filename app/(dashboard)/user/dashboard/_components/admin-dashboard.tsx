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
        <div className="bg-muted p-4 rounded-full">
          <Icon />
        </div>
        <div>
          {href ? (
            <Link href={href} className="text-3xl font-semibold">
              {value}
            </Link>
          ) : (
            <p className="text-3xl font-semibold">{value ?? "-"}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SystemMonitorCard() {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="bg-muted p-4 rounded-full group-hover:bg-background transition-colors">
            <Activity />
          </div>
          <div>
            <Link
              href="#1"
              className="flex items-center gap-2 underline underline-offset-4"
            >
              <span className="text-lg font-semibold">System Monitor</span>
              <ExternalLink className="h-5 w-5" />
            </Link>
            <p className="text-sm text-muted-foreground">
              View system health & logs
            </p>
          </div>
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
          value={data.containers?.used_containers ?? undefined}
          label="Running Projects"
          Icon={Container}
        />
        <StatCard
          value={data.containers?.max_containers ?? undefined}
          label="Remaining Projects"
          Icon={Boxes}
        />
        <StatCard
          value={data.database ?? undefined}
          label="Database status"
          Icon={Database}
        />
      </div>

      <RecentProjectsDataTable data={projects} />
    </div>
  );
}
