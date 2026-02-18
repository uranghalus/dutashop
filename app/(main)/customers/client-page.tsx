"use client";

import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import React from "react";
import { CustomerDialogs } from "./component/customer-dialogs";
import { CustomerPrimaryButton } from "./component/customer-primary-button";
import { CustomerTable } from "./component/customer-table";

export default function CustomersPage() {
  return (
    <DialogProvider>
      <Main fluid className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Customers</h1>
            <p className="text-sm text-muted-foreground">
              Manage customers, view purchase history, and more.
            </p>
          </div>
          <CustomerPrimaryButton />
        </div>

        <CustomerTable />

        <CustomerDialogs />
      </Main>
    </DialogProvider>
  );
}
