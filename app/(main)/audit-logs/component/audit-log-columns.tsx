"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AuditLog } from "@/generated/prisma/client";

// Extended type including user relation
export type AuditLogWithUser = AuditLog & {
  user?: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
};

export const auditLogColumns: ColumnDef<AuditLogWithUser>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      format(new Date(row.getValue("createdAt")), "dd MMM yyyy HH:mm"),
  },
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return user ? (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground italic">System / Unknown</span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      let colorClass = "bg-gray-100 text-gray-800";

      switch (action) {
        case "CREATE":
          colorClass = "bg-green-100 text-green-800";
          break;
        case "UPDATE":
          colorClass = "bg-blue-100 text-blue-800";
          break;
        case "DELETE":
          colorClass = "bg-red-100 text-red-800";
          break;
        case "LOGIN":
          colorClass = "bg-purple-100 text-purple-800";
          break;
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {action}
        </span>
      );
    },
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("entity")}</span>
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.entityId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") as string | null;
      if (!details) return <span className="text-muted-foreground">-</span>;

      try {
        // Determine if it's a JSON string or just text
        // Prisma stored it as String, but we stringified it.
        // However, display it nicely if possible.
        // For now, let's just show a truncated version or a "View" button if we had a modal.
        // Let's just show raw text truncated for now.
        return (
          <div
            className="max-w-[300px] truncate text-xs font-mono"
            title={details}
          >
            {details}
          </div>
        );
      } catch (e) {
        return <span>{details}</span>;
      }
    },
  },
];
