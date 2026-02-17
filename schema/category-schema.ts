// schema/category-schema.ts
import * as z from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters.')
    .max(50, 'Category name must be at most 50 characters.'),
});

export type CategoryForm = z.infer<typeof categoryFormSchema>;
