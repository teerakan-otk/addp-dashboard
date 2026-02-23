"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export function HistoryViewDetails({ id }: { id: string }) {
  const { data, isLoading } = useSWR(`/api/logs/${id}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">View Details</h1>
        <p className="text-sm text-muted-foreground">
          Information about this action
        </p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Event ID</p>
          <p className="font-medium">{data?.id}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Username</p>
          <p className="font-medium">{data?.username}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Action</p>
          <p className="font-medium">{data?.action}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p
            className={`font-medium ${
              data?.status === "SUCCESS" ? "text-green-600" : "text-red-600"
            }`}
          >
            {data?.status}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Timestamp</p>
          <p className="font-medium">{data?.created_at}</p>
        </div>
      </div>

      {/* Logs */}
      <pre className="border rounded-md shadow whitespace-pre-wrap text-sm p-4 overflow-auto max-h-125">
        {data?.details}
      </pre>
    </div>
  );
}
