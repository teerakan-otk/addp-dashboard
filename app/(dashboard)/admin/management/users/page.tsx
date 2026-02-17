import { Metadata } from "next";

import { UsersDataTable } from "@/features/users/components/users-data-table";

export const metadata: Metadata = {
  title: "User Management",
};

export default function Page() {
  return <UsersDataTable />;
}
