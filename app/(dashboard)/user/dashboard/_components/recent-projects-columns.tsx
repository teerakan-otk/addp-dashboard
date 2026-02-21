"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

export type Dashboard = {
  status: string;
};

export const RecentProjectsColumns: ColumnDef<Dashboard>[] = [
  {
    accessorKey: "name",
    header: "Container Name",
  },
  {
    accessorKey: "domain",
    header: "Domain",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const formatted =
        status.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();

      return (
        <Badge variant="outline">
          <Circle
            fill={status === "running" ? "#00a63e" : "#e7000b"}
            strokeWidth={0}
          />
          <span>{formatted}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
  },
];
