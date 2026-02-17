import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const CreateCustomerSchema = CustomerSchema.omit({ id: true });
export const UpdateCustomerSchema = CustomerSchema;
