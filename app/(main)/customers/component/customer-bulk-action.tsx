"use client";

import { DataTableBulkActions } from "@/components/datatable/datatable-bulk-action";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiDeleteBinLine } from "@remixicon/react";
import { type Table } from "@tanstack/react-table";
import { useState } from "react";
import { Customer } from "./customer-columns";
import { CustomerMultiDeleteDialog } from "./customer-multi-delete-dialog";

type CustomerBulkActionProps<TData> = {
  table: Table<TData>;
};

export function CustomerBulkAction<TData>({
  table,
}: CustomerBulkActionProps<TData>) {
  const [openDelete, setOpenDelete] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCustomers = selectedRows.map((row) => row.original as Customer);

  const handleOpenDelete = () => {
    if (selectedCustomers.length === 0) return;
    setOpenDelete(true);
  };

  return (
    <>
      <DataTableBulkActions table={table} entityName="customer">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-8"
              onClick={handleOpenDelete}
              aria-label="Delete selected customers"
            >
              <RiDeleteBinLine className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected customers</TooltipContent>
        </Tooltip>
      </DataTableBulkActions>

      <CustomerMultiDeleteDialog
        table={table}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  );
}
