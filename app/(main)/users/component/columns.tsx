"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/context/dialog-provider";
import {
  RiDeleteBinLine,
  RiEditLine,
  RiForbidLine,
  RiMore2Line,
  RiShieldCheckLine,
} from "@remixicon/react";
import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  image?: string | null;
  banned: boolean | null;
  banReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <div className="capitalize">{role || "User"}</div>;
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.getValue("banned") as boolean;
      return (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isBanned
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/80"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isBanned ? "Banned" : "Active"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction row={row.original} />,
  },
];

function CellAction({ row }: { row: User }) {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <RiMore2Line className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row);
            setOpen("edit");
          }}
        >
          <RiEditLine className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {row.banned ? (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row);
              setOpen("unban");
            }}
          >
            <RiShieldCheckLine className="mr-2 h-4 w-4" />
            Unban
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row);
              setOpen("ban");
            }}
            className="text-orange-600 focus:text-orange-600"
          >
            <RiForbidLine className="mr-2 h-4 w-4" />
            Ban
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row);
            setOpen("delete");
          }}
          className="text-destructive focus:text-destructive"
        >
          <RiDeleteBinLine className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
