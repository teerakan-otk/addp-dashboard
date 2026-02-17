"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PanelsTopLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TotalProjectsCard() {
  const { data, isLoading } = useSWR(
    "/api/dashboard/total/containers",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 5000,
      keepPreviousData: true,
    },
  );

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <PanelsTopLeft className="h-5 w-5" />
          Projects
        </CardTitle>
        <CardDescription>
          <Badge variant="outline">Total</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold text-foreground text-center">
          {data.data?.containers?.total}
        </p>
      </CardContent>
    </Card>
  );
}
