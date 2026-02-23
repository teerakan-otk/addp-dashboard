"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";

import { ProfileInfoCard } from "./profile-info-card";
import { ProfileReadDocsCard } from "./profile-read-docs-card";
import { ProfileDBCard } from "./profile-db-card";

export function Profile() {
  const { data, isLoading } = useSWR(`/api/profile`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <ProfileInfoCard data={data} />
      <ProfileDBCard />
      <ProfileReadDocsCard label="Read documentation" />
    </div>
  );
}
