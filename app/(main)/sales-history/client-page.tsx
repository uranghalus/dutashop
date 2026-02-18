"use client";

import { Main } from "@/components/main";
import React from "react";
import { HistoryTable } from "./component/history-table";
import { DialogProvider } from "@/context/dialog-provider";
import { HistoryDetailsDialog } from "./component/history-details-dialog";

export default function SalesHistoryPage() {
  return (
    <DialogProvider>
      <Main fluid className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Riwayat Penjualan</h1>
          <p className="text-sm text-muted-foreground">
            View past transactions
          </p>
        </div>
        <HistoryTable />
        <HistoryDetailsDialog />
      </Main>
    </DialogProvider>
  );
}
