"use client";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { useTransactions } from "@/hooks/crud/use-history";
import React, { useState } from "react";
import { historyColumns } from "./history-columns";
import {
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";

export function HistoryTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: queryData, isLoading: isQueryLoading } = useTransactions({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const table = useReactTable({
    data: queryData?.data ?? [],
    columns: historyColumns,
    pageCount: queryData?.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const pageCount = queryData?.pageCount ?? 0;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <DataTable table={table} loading={isQueryLoading} />
      </div>
      <DataTablePagination table={table} pageCount={pageCount} />
    </div>
  );
}
