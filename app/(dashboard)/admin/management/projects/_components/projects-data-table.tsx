"use client";

import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableHeader } from "@/components/data-table-header";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Button } from "@/components/ui/button";
import { ProjectsColumns } from "./projects-columns";

export function ProjectsDataTable() {
  const { data, isLoading } = useSWR("/api/containers", fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: data ?? [],
    columns: ProjectsColumns,
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Projects Management</h1>

      {/* Content */}
      <div>
        <DataTableHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        >
          <Button variant="outline" asChild>
            <Link href={"/admin/management/projects/upload"}>Upload</Link>
          </Button>
        </DataTableHeader>
        <DataTable table={table} columns={ProjectsColumns} />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
