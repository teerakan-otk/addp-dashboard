"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";

import { ProfileCard } from "./profile-card";
import { ContainersCard } from "./containers-card";
import { DatabaseCard } from "./database-card";
import { DocsCard } from "@/components/docs-card";

export function Profile() {
  const { data, isLoading } = useSWR(`/api/profile`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (isLoading) return null;
  return (
    <div className="space-y-6">
      <div>
        <ProfileCard data={data} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <ContainersCard data={data} />
        <DatabaseCard data={data} />
        <DocsCard label="Read documentation" />
      </div>
    </div>
  );
}
