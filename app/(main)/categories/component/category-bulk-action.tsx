'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { RiDeleteBinLine } from '@remixicon/react'

import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions } from '@/components/datatable/datatable-bulk-action'
import { category } from '@/generated/prisma/client'
import { CategoryMultiDeleteDialog } from './category-multi-delete-dialog'


type CategoryBulkActionsProps<TData> = {
    table: Table<TData>
}

export function CategoryBulkActions<TData>({
    table,
}: CategoryBulkActionsProps<TData>) {
    const [openDelete, setOpenDelete] = useState(false)

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedCategories = selectedRows.map(
        (row) => row.original as category
    )

    const handleOpenDelete = () => {
        if (selectedCategories.length === 0) return
        setOpenDelete(true)
    }

    return (
        <>
            <DataTableBulkActions table={table} entityName="category">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="size-8"
                            onClick={handleOpenDelete}
                            aria-label="Delete selected categories"
                        >
                            <RiDeleteBinLine className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Delete selected categories
                    </TooltipContent>
                </Tooltip>
            </DataTableBulkActions>

            <CategoryMultiDeleteDialog
                table={table}
                open={openDelete}
                onOpenChange={setOpenDelete}
            />
        </>
    )
}
