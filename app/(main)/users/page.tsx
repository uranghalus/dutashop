"use client";

import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import React from "react";
import { UserDialogs } from "./component/user-dialogs";
import { UserPrimaryButton } from "./component/user-primary-button";
import { UserTable } from "./component/user-table";

export default function UsersPage() {
  return (
    <DialogProvider>
      <Main fluid className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and access status.
            </p>
          </div>
          <UserPrimaryButton />
        </div>

        <UserTable />

        <UserDialogs />
      </Main>
    </DialogProvider>
  );
}
