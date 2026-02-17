import type { Metadata } from "next";

import { HistoryViewDetails } from "@/features/history/components/history-view-details";

export const metadata: Metadata = {
  title: "View Details",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <HistoryViewDetails id={id} />;
}
