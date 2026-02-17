"use client";

import { useState } from "react";
import { RiErrorWarningLine } from "@remixicon/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteUser } from "@/hooks/crud/use-user";

type UserDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: {
    id: string;
    name: string;
  };
};

export function UserDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState("");
  const deleteMutation = useDeleteUser();

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
          Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete user{" "}
            <span className="font-semibold">{currentRow.name}</span>
            ?
            <br />
            This action will permanently remove this user from the system. This
            action cannot be undone.
          </p>

          <Label className="space-y-2">
            <span>
              Type <strong>{currentRow.name}</strong> to confirm:
            </span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter user name to confirm deletion"
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
