"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteCustomer } from "@/hooks/crud/use-customer";
import { RiErrorWarningLine } from "@remixicon/react";
import { useState } from "react";

type CustomerDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: {
    id: string;
    name: string;
  };
};

export function CustomerDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomerDeleteDialogProps) {
  const [value, setValue] = useState("");
  const deleteMutation = useDeleteCustomer();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return;

    await deleteMutation.mutateAsync(currentRow.id);
    setValue("");
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) setValue("");
        onOpenChange(state);
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || deleteMutation.isPending}
      title={
        <span className="text-destructive flex items-center gap-2">
          <RiErrorWarningLine className="size-4 text-destructive" />
          Delete Customer
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete customer{" "}
            <span className="font-semibold">{currentRow.name}</span>?
            <br />
            This action cannot be undone.
          </p>

          <Label className="space-y-2">
            <span>
              Type <strong>{currentRow.name}</strong> to confirm:
            </span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter customer name to confirm"
            />
          </Label>
        </div>
      }
      confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
