"use client";

import { usePathname } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { ColumnActions } from "@/components/column-actions";

export type ColumnProps = {
  id: string | number;
  status: string;
};

export const ProjectsColumns: ColumnDef<ColumnProps>[] = [
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "container_name",
    header: "Container name",
  },
  {
    accessorKey: "domain",
    header: "Domain",
  },
  {
    accessorKey: "publish",
    header: "Publish",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const formatted = status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <Badge variant="outline">
          <Circle
            fill={status === "running" ? "green" : "red"}
            strokeWidth={0}
          />
          <span>{formatted}</span>
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const pathname = usePathname();

      return (
        <ColumnActions
          viewURL={pathname + `/${id}/view`}
          editURL={pathname + `/${id}/edit`}
          deleteURL={`/api/containers/${id}`}
        />
      );
    },
  },
];
