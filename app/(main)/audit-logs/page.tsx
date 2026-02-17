"use client";

import { Main } from "@/components/main";
import React from "react";
import { AuditLogTable } from "./component/audit-log-table";

export default function AuditLogsPage() {
  return (
    <Main fluid className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Monitor system activities and user actions.
        </p>
      </div>
      <AuditLogTable />
    </Main>
  );
}
