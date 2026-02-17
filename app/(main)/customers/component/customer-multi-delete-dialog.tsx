"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDeleteCustomers } from "@/hooks/crud/use-customer";
import { RiErrorWarningLine } from "@remixicon/react";
import { type Table } from "@tanstack/react-table";
import { Customer } from "./customer-columns";

type CustomerMultiDeleteDialogProps<TData> = {
  table: Table<TData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CustomerMultiDeleteDialog<TData>({
  table,
  open,
  onOpenChange,
}: CustomerMultiDeleteDialogProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const customers = selectedRows.map((row) => row.original as Customer);

  const { mutate, isPending } = useDeleteCustomers();

  const handleDelete = async () => {
    mutate(
      customers.map((c) => c.id),
      {
        onSuccess: () => {
          table.resetRowSelection();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isPending}
      title={
        <span className="text-destructive flex items-center gap-2">
          <RiErrorWarningLine className="size-4" />
          Delete Customers
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{customers.length}</span> customers?
          </p>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action will permanently delete the selected customers. This
              cannot be undone.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
