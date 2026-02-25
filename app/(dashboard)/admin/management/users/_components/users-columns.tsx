"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { ColumnActions } from "@/components/column-actions";

type ColumnProps = {
  id: number;
  username: string;
  email: string;
  role: string;
  container: {
    used: number;
    max: number;
  };
  database: number;
  status: number;
};

export const UsersColumns: ColumnDef<ColumnProps>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;

      const formattedRole =
        role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase();

      return <div>{formattedRole}</div>;
    },
  },
  {
    accessorKey: "container",
    header: "Containers",
    cell: ({ row }) => {
      const used = Number(row.original.container.used);
      const max = Number(row.original.container.max);

      return (
        <div>
          {used} / {max}
        </div>
      );
    },
  },
  {
    accessorKey: "database",
    header: "Database Status",
    cell: ({ row }) => {
      const database: number = row.original.database;

      let label = "";
      let color = "";

      switch (database) {
        case 0:
          label = "Disconnected";
          color = "#9ca3af"; // gray
          break;

        case 1:
          label = "Pending Activation";
          color = "#f59e0b"; // amber
          break;

        case 2:
          label = "Connected";
          color = "#22c55e"; // green
          break;

        case 3:
          label = "Pending Deactivation";
          color = "#f97316"; // orange
          break;

        default:
          label = "Unknown";
          color = "#6b7280";
      }

      return (
        <Badge variant="outline" className="flex items-center gap-2">
          <Circle size={8} fill={color} strokeWidth={0} />
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status === 1 ? "enabled" : "disabled";
      const color = status === "enabled" ? "#22c55e" : "red";

      return (
        <Badge variant="outline" className="flex items-center gap-2">
          <Circle size={8} fill={color} strokeWidth={0} />
          {status.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <ColumnActions
          viewURL={`/admin/management/users/${id}`}
          editURL={`/admin/management/users/${id}/edit`}
          deleteURL={`/api/users/${id}`}
          mutateKey="/api/users"
        />
      );
    },
  },
];
