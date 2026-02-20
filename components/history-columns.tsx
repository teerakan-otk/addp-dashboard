"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnActions } from "@/components/column-actions";
import { Button } from "./ui/button";

export type ColumnProps = {
  id: number;
  action: string;
  status: string;
};

export const HistoryColumns: ColumnDef<ColumnProps>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "container_name",
    header: "Container name",
  },
  {
    accessorKey: "action",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.action;

      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color = status === "SUCCESS" ? "green" : "red";

      return (
        <Badge variant="outline" className="flex items-center gap-2">
          <Circle size={8} fill={color} strokeWidth={0} />
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;

      return <ColumnActions viewURL={`/admin/history/${id}`} />;
    },
  },
];
