"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RiEyeLine } from "@remixicon/react";
import { useDialog } from "@/context/dialog-provider";
import { format } from "date-fns";

// Define the shape of our data based on what getTransactions returns
export type TransactionWithDetails = {
  id: string;
  total: number;
  paymentMethod: string;
  createdAt: Date;
  cashier: {
    name: string;
  };
  customer?: {
    name: string;
    phone?: string | null;
    address?: string | null;
  } | null;
  items: any[]; // We can be more specific if needed
};

export const historyColumns: ColumnDef<TransactionWithDetails>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      format(new Date(row.getValue("createdAt")), "dd MMM yyyy HH:mm"),
  },
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <span className="font-mono text-xs">{id.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => {
      const customerName = row.original.customer?.name;
      return (
        <span className={customerName ? "" : "text-muted-foreground italic"}>
          {customerName || "Guest"}
        </span>
      );
    },
  },
  {
    accessorKey: "cashier.name",
    header: "Cashier",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ViewDetailsAction row={row} />,
  },
];

function ViewDetailsAction({ row }: { row: any }) {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setCurrentRow(row.original);
        setOpen("view");
      }}
    >
      <RiEyeLine className="size-4 mr-1" />
      Details
    </Button>
  );
}
