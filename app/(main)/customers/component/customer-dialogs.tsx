"use client";

import { useDialog } from "@/context/dialog-provider";
import { CustomerActionDialog } from "./customer-action-dialog";
import { CustomerDeleteDialog } from "./customer-delete-dialog";

export function CustomerDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      <CustomerActionDialog
        key="customer-add"
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
      />

      {currentRow && (
        <>
          <CustomerActionDialog
            key={`customer-edit-${(currentRow as any).id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? "edit" : null);
              if (!isOpen) setCurrentRow(undefined);
            }}
            currentRow={currentRow}
          />

          <CustomerDeleteDialog
            key={`customer-delete-${(currentRow as any).id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? "delete" : null);
              if (!isOpen) setCurrentRow(undefined);
            }}
            currentRow={currentRow as any}
          />
        </>
      )}
    </>
  );
}
