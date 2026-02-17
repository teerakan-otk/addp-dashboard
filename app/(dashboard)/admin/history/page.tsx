import type { Metadata } from "next";

import { HistoryDataTable } from "@/features/history/components/history-data-table";

export const metadata: Metadata = {
  title: "History",
};

export default function Page() {
  return <HistoryDataTable />;
}
