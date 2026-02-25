"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";

import { ProfileInfoCard } from "./profile-info-card";
import { ProfileReadDocsCard } from "./profile-read-docs-card";
import { ProfileDBCard } from "./profile-db-card";

export function Profile() {
  const { data, isLoading, mutate } = useSWR(`/api/profile`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <ProfileInfoCard data={data} />

      <div className="grid md:grid-cols-2 gap-6">
        <ProfileDBCard data={data} mutate={mutate} />

        <div>
          <ProfileReadDocsCard />
        </div>
      </div>
    </div>
  );
}
