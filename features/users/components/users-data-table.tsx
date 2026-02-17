"use client";

import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

import { DataTableHeader } from "@/components/data-table-header";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Button } from "@/components/ui/button";
import { UsersColumns } from "./users-columns";

export function UsersDataTable() {
  const { data, isLoading } = useSWR("/api/v2/users", fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: data?.users || [],
    columns: UsersColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
    },
  });

  if (isLoading) return null;

  // ------------------------------------
  // Render
  // ------------------------------------
  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="text-3xl font-semibold">User Management</h1>

      {/* Content */}
      <div>
        <DataTableHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        >
          <Button variant="outline" asChild>
            <Link href="/admin/management/users/create">Create</Link>
          </Button>
        </DataTableHeader>

        <DataTable table={table} columns={UsersColumns} />

        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
