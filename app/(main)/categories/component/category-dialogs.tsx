/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useDialog } from '@/context/dialog-provider'
import { CategoryActionDialog } from './category-action-dialog'
import { CategoryDeleteDialog } from './category-delete-dialog'

export default function CategoryDialogs() {
    const { currentRow, open, setCurrentRow, setOpen } = useDialog()

    return (
        <>
            {/* ADD */}
            <CategoryActionDialog
                key="category-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    {/* EDIT */}
                    <CategoryActionDialog
                        key={`category-edit-${(currentRow as any).id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />

                    {/* DELETE */}
                    <CategoryDeleteDialog
                        key={`category-delete-${(currentRow as any).id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setCurrentRow(undefined)
                        }}
                        currentRow={currentRow as any}
                    />
                </>
            )}
        </>
    )
}
