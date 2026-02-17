"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr";

export function EditProjectForm({ id }: { id: string }) {
  const { data, isLoading } = useSWR(`/api/containers/${id}`, fetcher);

  if (isLoading) return null;

  return <div>{data.data?.id}</div>;
}
