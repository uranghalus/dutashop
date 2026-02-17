"use client";

import { useEffect } from "react";
import { format } from "date-fns";

export default function PrintPageClient({ transaction }: { transaction: any }) {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="p-8 max-w-[80mm] mx-auto font-mono text-sm leading-tight">
      <div className="text-center mb-4">
        <h1 className="font-bold text-lg">E-SHOP POS</h1>
        <p>Jl. Contoh No. 123</p>
        <p>Telp: 0812-3456-7890</p>
      </div>

      <div className="border-b border-dashed my-2" />

      <div className="flex justify-between mb-1">
        <span>Date:</span>
        <span>{format(new Date(transaction.createdAt), "dd/MM/yy HH:mm")}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Trans ID:</span>
        <span>{transaction.id.slice(0, 8)}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Cashier:</span>
        <span>{transaction.cashier?.name}</span>
      </div>

      <div className="border-b border-dashed my-2" />

      <div className="space-y-2">
        {transaction.items.map((item: any) => (
          <div key={item.id} className="flex flex-col">
            <span>{item.product.name}</span>
            <div className="flex justify-between pl-4">
              <span>
                {item.quantity} x{" "}
                {new Intl.NumberFormat("id-ID").format(item.price)}
              </span>
              <span>
                {new Intl.NumberFormat("id-ID").format(
                  item.quantity * item.price,
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-dashed my-2" />

      <div className="flex justify-between font-bold text-lg">
        <span>TOTAL</span>
        <span>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(transaction.total)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Payment</span>
        <span>{transaction.paymentMethod}</span>
      </div>

      <div className="border-b border-dashed my-2" />

      <div className="text-center mt-4">
        <p>Thank you for shopping!</p>
        <p>Please come again.</p>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
