"use client";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { useCustomers } from "@/hooks/crud/use-customer";
import {
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "./customer-columns";
import { CustomerBulkAction } from "./customer-bulk-action";

export function CustomerTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: queryData, isLoading: isQueryLoading } = useCustomers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  });

  const table = useReactTable({
    data: (queryData?.data as any[]) ?? [],
    columns,
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
      {/* Bulk Actions */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <CustomerBulkAction table={table} />
      )}

      <div className="rounded-md border">
        <DataTable table={table} loading={isQueryLoading} />
      </div>
      <DataTablePagination table={table} pageCount={pageCount} />
    </div>
  );
}
