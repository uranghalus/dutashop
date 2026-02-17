"use client";

import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { RiDeleteBinLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions } from "@/components/datatable/datatable-bulk-action";
import { UserMultiDeleteDialog } from "./user-multi-delete-dialog";
import { User } from "./columns";

type UserBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function UserBulkActions<TData>({ table }: UserBulkActionsProps<TData>) {
  const [openDelete, setOpenDelete] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedUsers = selectedRows.map((row) => row.original as User);

  const handleOpenDelete = () => {
    if (selectedUsers.length === 0) return;
    setOpenDelete(true);
  };

  return (
    <>
      <DataTableBulkActions table={table} entityName="user">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-8"
              onClick={handleOpenDelete}
              aria-label="Delete selected users"
            >
              <RiDeleteBinLine className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected users</TooltipContent>
        </Tooltip>
      </DataTableBulkActions>

      <UserMultiDeleteDialog
        table={table}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  );
}
