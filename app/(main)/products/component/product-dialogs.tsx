/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDialog } from "@/context/dialog-provider";
import { ProductActionSheet } from "./product-action-sheet";
import { ProductDeleteDialog } from "./product-delete-dialog";

export default function ProductDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useDialog();

  return (
    <>
      {/* ADD - SHEET */}
      <ProductActionSheet
        key="product-add"
        open={open === "add"}
        onOpenChange={(isOpen) => {
          if (isOpen) setOpen("add");
          else setOpen(null);
        }}
      />

      {currentRow && (
        <>
          {/* EDIT - SHEET */}
          <ProductActionSheet
            key={`product-edit-${(currentRow as any).id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              if (isOpen) setOpen("edit");
              else {
                setOpen(null);
                setCurrentRow(undefined);
              }
            }}
            currentRow={currentRow as any}
          />

          {/* DELETE - DIALOG */}
          <ProductDeleteDialog
            key={`product-delete-${(currentRow as any).id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              if (isOpen) setOpen("delete");
              else {
                setOpen(null);
                setCurrentRow(undefined);
              }
            }}
            currentRow={currentRow as any}
          />
        </>
      )}
    </>
  );
}
