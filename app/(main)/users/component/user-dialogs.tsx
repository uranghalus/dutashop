"use client";

import { useDialog } from "@/context/dialog-provider";
import { UserActionDialog } from "./user-action-dialog";
import { UserDeleteDialog } from "./user-delete-dialog";
import { BanUserDialog, UnbanUserDialog } from "./ban-user-dialog";

export function UserDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      <UserActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
      />

      {currentRow && (
        <>
          {/* EDIT */}
          <UserActionDialog
            key={`user-edit-${(currentRow as any).id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? "edit" : null);
              if (!isOpen) setCurrentRow(undefined);
            }}
            currentRow={currentRow}
          />

          {/* DELETE */}
          <UserDeleteDialog
            key={`user-delete-${(currentRow as any).id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? "delete" : null);
              if (!isOpen) setCurrentRow(undefined);
            }}
            currentRow={currentRow as any}
          />

          {/* BAN */}
          <BanUserDialog />

          {/* UNBAN */}
          <UnbanUserDialog />
        </>
      )}
    </>
  );
}
