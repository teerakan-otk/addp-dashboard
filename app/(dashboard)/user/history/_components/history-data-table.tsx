"use client";

import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { HistoryColumns } from "./history-columns";
import { DataTableHeader } from "@/components/data-table-header";
import { DataTablePagination } from "@/components/data-table-pagination";

export function HistoryDataTable() {
  const { data, isLoading } = useSWR("/api/logs", fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: data?.activity_logs || [],
    columns: HistoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  });

  if (isLoading) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="text-3xl font-semibold">History</h1>

      {/* Content */}
      <div>
        <DataTableHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <DataTable table={table} columns={HistoryColumns} />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
