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
    total: number;
  };
  database: string;
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
      const total = Number(row.original.container.total);

      return (
        <div>
          {used} / {total}
        </div>
      );
    },
  },
  {
    accessorKey: "database",
    header: "Database",
    cell: ({ row }) => {
      const database = row.original.database;

      const color =
        database === "connected"
          ? "green"
          : database === "request"
            ? "yellow"
            : "red";

      return (
        <Badge variant="outline" className="flex items-center gap-2">
          <Circle size={8} fill={color} strokeWidth={0} />
          {database}
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
          viewURL={`/admin/management/users/${id}/view`}
          editURL={`/admin/management/users/${id}/edit`}
          deleteURL={`/api/users/${id}`}
          mutateKey="/api/users"
        />
      );
    },
  },
];
