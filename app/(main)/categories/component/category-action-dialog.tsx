'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { category } from '@/generated/prisma/client'
import {
    categoryFormSchema,
    CategoryForm,
} from '@/schema/category-schema'
import { useCreateCategory, useUpdateCategory } from '@/hooks/crud/use-category'



type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: category
}

export function CategoryActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const createMutation = useCreateCategory()
    const updateMutation = useUpdateCategory()

    const form = useForm<CategoryForm>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: '',
        },
    })

    /* =========================
       RESET SAAT OPEN
    ========================= */
    React.useEffect(() => {
        if (open) {
            form.reset({
                name: currentRow?.name ?? '',
            })
        }
    }, [open, currentRow, form])

    const isPending =
        createMutation.isPending || updateMutation.isPending

    /* =========================
       SUBMIT
    ========================= */
    const onSubmit = async (values: CategoryForm) => {
        try {
            const formData = new FormData()
            formData.append('name', values.name)

            if (isEdit && currentRow) {
                await updateMutation.mutateAsync({
                    id: currentRow.id,
                    formData,
                })
                toast.success('Category updated successfully')
            } else {
                await createMutation.mutateAsync(formData)
                toast.success('Category created successfully')
            }

            form.reset()
            onOpenChange(false)
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update category data.'
                            : 'Create a new category.'}
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="category-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="category-name">
                                        Category Name
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="category-name"
                                        placeholder="Electronics"
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <Field orientation="horizontal">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={isPending}
                        >
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            form="category-form"
                            disabled={isPending}
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </Field>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
