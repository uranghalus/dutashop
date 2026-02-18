import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import React from "react";
import ProductPrimaryButton from "./component/product-primary-button";
import { ProductTable } from "./component/product-table";
import ProductDialogs from "./component/product-dialogs";

import { requireAccess } from "@/lib/auth-guard";

export default async function ProductPage() {
  await requireAccess("product", "read");
  return (
    <DialogProvider>
      <Main fluid className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Data Produk</h1>
            <p className="text-sm text-muted-foreground">
              Pengelolaan data produk
            </p>
          </div>

          <ProductPrimaryButton />
        </div>

        <ProductTable />
      </Main>

      <ProductDialogs />
    </DialogProvider>
  );
}
