"use client";

import { type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";
import { product } from "@/generated/prisma/client";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";

type DataTableRowActionsProps<TData extends { id: string }> = {
  row: Row<TData>;
};

export function ProductRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <ButtonGroup>
      {/* EDIT */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("edit");
        }}
      >
        <RiEditLine className="size-4" />
      </Button>

      {/* DELETE */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("delete");
        }}
      >
        <RiDeleteBinLine className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
