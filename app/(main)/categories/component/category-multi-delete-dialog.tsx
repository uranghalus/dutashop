'use client'

import { RiErrorWarningLine } from '@remixicon/react'
import { type Table } from '@tanstack/react-table'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { category } from '@/generated/prisma/client'
import { useDeleteCategoryBulk } from '@/hooks/crud/use-category'


type CategoryMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CategoryMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: CategoryMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const categories = selectedRows.map(
        (row) => row.original as category
    )

    const { mutate, isPending } = useDeleteCategoryBulk()

    const handleDelete = async () => {
        mutate(
            categories.map((c) => c.id),
            {
                onSuccess: () => {
                    table.resetRowSelection()
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            isLoading={isPending}
            title={
                <span className="text-destructive flex items-center gap-2">
                    <RiErrorWarningLine className="size-4" />
                    Delete Categories
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">
                            {categories.length}
                        </span>{' '}
                        categor{categories.length > 1 ? 'ies' : 'y'}?
                    </p>

                    <Alert variant="destructive">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action will permanently delete the selected categories.
                            This cannot be undone.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText={isPending ? 'Deleting...' : 'Delete'}
            destructive
        />
    )
}
