import type { Metadata } from "next";

import { AdminDashboard } from "./_components/admin-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  return <AdminDashboard />;
}
