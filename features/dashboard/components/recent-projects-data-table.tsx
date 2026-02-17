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

import { DataTablePagination } from "@/components/data-table-pagination";
import { RecentProjectsColumns } from "./recent-projects-columns";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentProjectsDataTable({ data }: { data: any }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: data,
    columns: RecentProjectsColumns,
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

  return (
    <div>
      <DataTable table={table} columns={RecentProjectsColumns} />
      <DataTablePagination table={table} />
    </div>
  );
}
