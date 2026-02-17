'use client'

import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { category } from '@/generated/prisma/client'
import { cn } from '@/lib/utils'
import { Column, ColumnDef } from '@tanstack/react-table'
import { CategoryRowActions } from './category-row-actions'


export type CategoryColumn = category

export const categoryColumns: ColumnDef<CategoryColumn>[] = [
    /* =======================
       SELECT
    ======================= */
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) =>
                    row.toggleSelected(!!value)
                }
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },

    /* =======================
       NAME
    ======================= */
    {
        accessorKey: 'name',
        header: ({ column }: { column: Column<CategoryColumn, unknown> }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ cell }) => (
            <div className="font-medium ps-2">
                {cell.getValue<string>()}
            </div>
        ),
        size: 180,
    },

    /* =======================
       CREATED AT
    ======================= */
    {
        accessorKey: 'createdAt',
        header: ({ column }: { column: Column<CategoryColumn, unknown> }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ cell }) => {
            const date = cell.getValue<Date>()
            return (
                <div className="ps-2 text-sm text-muted-foreground">
                    {new Date(date).toLocaleDateString()}
                </div>
            )
        },
        size: 120,
    },

    /* =======================
       ACTIONS
    ======================= */
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Aksi"
                className="ml-auto"
            />
        ),
        size: 48,
        minSize: 48,
        maxSize: 48,
        enableResizing: false,
        cell: CategoryRowActions,
        meta: {
            className: cn(
                'sticky right-0 z-10 w-[60px] px-2',
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200',
            ),
        },
    },
]
