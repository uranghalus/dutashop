"use client";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { useAuditLogs } from "@/hooks/crud/use-audit-logs";
import React, { useState } from "react";
import { auditLogColumns } from "./audit-log-columns";
import {
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";

export function AuditLogTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: queryData, isLoading: isQueryLoading } = useAuditLogs({
    page: pagination.pageIndex + 1, // API likely expects 1-based index if copied from product-action logic, checking...
    // Wait, product-action was 0-based index * pageSize. history-action was page * pageSize.
    // Let's check audit-action implementation again.
    // audit-action: const skip = (page - 1) * pageSize -> It expects 1-based index.
    pageSize: pagination.pageSize,
  });

  const table = useReactTable({
    data: queryData?.data ?? [],
    columns: auditLogColumns,
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
