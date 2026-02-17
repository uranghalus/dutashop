"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { RiAddLine } from "@remixicon/react";

export function CustomerPrimaryButton() {
  const { setOpen } = useDialog();

  return (
    <Button onClick={() => setOpen("add")}>
      <RiAddLine className="mr-2 size-4" />
      Add Customer
    </Button>
  );
}
