"use client";

import { type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useDialog } from "@/context/dialog-provider";
import { category } from "@/generated/prisma/client";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";

type DataTableRowActionsProps = {
  row: Row<category>;
};

import { authClient } from "@/lib/auth-client";

export function CategoryRowActions({ row }: DataTableRowActionsProps) {
  const { data: session } = authClient.useSession();
  const { setOpen, setCurrentRow } = useDialog();

  if (session?.user.role !== "admin") return null;

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
