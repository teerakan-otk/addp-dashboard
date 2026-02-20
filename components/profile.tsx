"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";

import { DocsCard } from "@/components/docs-card";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileContainersCard } from "./profile-containers-card";
import { ProfileDBCard } from "./profile-db-card";

export function Profile() {
  const { data, isLoading } = useSWR(`/api/profile`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <div>
        <ProfileInfoCard data={data} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <ProfileContainersCard data={data} />
        <ProfileDBCard data={data} />
        <DocsCard label="Read documentation" />
      </div>
    </div>
  );
}
