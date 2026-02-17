import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  stock: z.coerce
    .number()
    .int()
    .min(0, "Stock must be a non-negative integer."),
  sku: z.string().min(1, "SKU is required."),
  categoryId: z.string().min(1, "Category is required."),
});

export type ProductForm = z.infer<typeof productFormSchema>;
