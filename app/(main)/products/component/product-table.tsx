/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { DataTablePagination } from "@/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";

import { productColumns } from "./product-columns";
import { useDataTable } from "@/hooks/use-data-table";
import { useProducts } from "@/hooks/crud/use-product";

export function ProductTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useProducts({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns: productColumns as any,
    columnResizeMode: "onEnd",

    pageCount: Math.ceil(data?.pageCount ?? 0),
    pagination,
    onPaginationChange: setPagination,
  });

  return (
    <div className="p-3 rounded-md border space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="name"
        searchPlaceholder="Search product..."
      />

      <DataTable table={table} loading={isLoading} />

      <DataTablePagination
        table={table}
        pageCount={Math.ceil(data?.pageCount ?? 0)}
      />
    </div>
  );
}
