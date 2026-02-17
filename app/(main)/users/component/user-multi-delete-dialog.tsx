"use client";

import { RiErrorWarningLine } from "@remixicon/react";
import { type Table } from "@tanstack/react-table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { User } from "./columns"; // Import User type
import { useDeleteUsers } from "@/hooks/crud/use-user";

type UserMultiDeleteDialogProps<TData> = {
  table: Table<TData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserMultiDeleteDialog<TData>({
  table,
  open,
  onOpenChange,
}: UserMultiDeleteDialogProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const users = selectedRows.map((row) => row.original as User);

  const { mutate, isPending } = useDeleteUsers();

  const handleDelete = async () => {
    mutate(
      users.map((u) => u.id),
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
          Delete Users
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{users.length}</span> user
            {users.length > 1 ? "s" : ""}?
          </p>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action will permanently delete the selected users. This
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
