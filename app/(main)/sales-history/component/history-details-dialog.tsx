"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RiPrinterLine } from "@remixicon/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDialog } from "@/context/dialog-provider";
import { TransactionWithDetails } from "./history-columns";
import { format } from "date-fns";

export function HistoryDetailsDialog() {
  const { open, setOpen, currentRow } = useDialog();

  const isOpen = open === "view";
  const transaction = currentRow as TransactionWithDetails;

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && setOpen(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Transaction Details</DialogTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(`/receipt/${transaction.id}`, "_blank")
              }
            >
              <RiPrinterLine className="size-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold">ID:</div>
            <div className="font-mono">{transaction.id}</div>

            <div className="font-semibold">Date:</div>
            <div>
              {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm")}
            </div>

            <div className="font-semibold">Cashier:</div>
            <div>{transaction.cashier?.name}</div>

            <div className="font-semibold">Customer:</div>
            <div>
              {transaction.customer ? (
                <div className="flex flex-col">
                  <span>{transaction.customer.name}</span>
                  {transaction.customer.phone && (
                    <span className="text-xs text-muted-foreground">
                      {transaction.customer.phone}
                    </span>
                  )}
                  {transaction.customer.address && (
                    <span className="text-xs text-muted-foreground">
                      {transaction.customer.address}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground italic">Guest</span>
              )}
            </div>

            <div className="font-semibold">Payment:</div>
            <div>{transaction.paymentMethod}</div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("id-ID").format(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("id-ID").format(
                        item.price * item.quantity,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-bold text-right">
                    Total
                  </TableCell>
                  <TableCell className="font-bold text-right">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(transaction.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
