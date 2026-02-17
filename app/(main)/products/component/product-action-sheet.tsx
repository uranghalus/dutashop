"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { product, Prisma } from "@/generated/prisma/client";
import { productFormSchema, ProductForm } from "@/schema/product-schema";
import { useCreateProduct, useUpdateProduct } from "@/hooks/crud/use-product";
import { useCategories } from "@/hooks/crud/use-category";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Omit<product, "price"> & {
    price: number | Prisma.Decimal;
  };
};

export function ProductActionSheet({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow;

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  // Fetch categories for the select input
  // Assuming we want a list for selection, page size 100 might be enough or implement search later
  const { data: categoryData } = useCategories({ page: 0, pageSize: 100 });
  const categories = categoryData?.data ?? [];

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      sku: "",
      categoryId: "",
    },
  });

  /* =========================
       RESET SAAT OPEN
    ========================= */
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name ?? "",
        description: currentRow?.description ?? "",
        price: currentRow?.price ? parseFloat(currentRow.price.toString()) : 0,
        stock: currentRow?.stock ?? 0,
        sku: currentRow?.sku ?? "",
        categoryId: currentRow?.categoryId ?? "",
      });
    }
  }, [open, currentRow, form]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  /* =========================
       SUBMIT
    ========================= */
  const onSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description)
        formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("stock", values.stock.toString());
      formData.append("sku", values.sku);
      formData.append("categoryId", values.categoryId);

      if (isEdit && currentRow) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          formData,
        });
        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Product created successfully");
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update product data." : "Create a new product."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4 px-4"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    placeholder="Product Name"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="sku"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
                  <Input
                    {...field}
                    id="product-sku"
                    placeholder="SKU-123"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-price">Price</FieldLabel>
                    <Input
                      {...field}
                      value={(field.value as string | number) ?? ""}
                      id="product-price"
                      type="number"
                      min="0"
                      placeholder="0"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
                    <Input
                      {...field}
                      value={(field.value as string | number) ?? ""}
                      id="product-stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">Category</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger id="product-category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-desc">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="product-desc"
                    placeholder="Product description (optional)"
                    className="resize-none"
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

        <SheetFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>

            <Button type="submit" form="product-form" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
