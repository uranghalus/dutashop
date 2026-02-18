import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import React from "react";
import CategoryPrimaryButton from "./component/category-primary-button";
import { CategoryTable } from "./component/category-table";
import CategoryDialogs from "./component/category-dialogs";

import { requireAccess } from "@/lib/auth-guard";

export default async function CategoryPage() {
  await requireAccess("category", "read");
  return (
    <DialogProvider>
      <Main fluid className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Data Category</h1>
            <p className="text-sm text-muted-foreground">
              Pengelolaan data category
            </p>
          </div>

          <CategoryPrimaryButton />
        </div>

        <CategoryTable />
      </Main>

      <CategoryDialogs />
    </DialogProvider>
  );
}
