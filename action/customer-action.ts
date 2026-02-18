"use server";

import { requireAccess } from "@/lib/auth-guard";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-service";
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from "@/schema/customer-schema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getCustomers(params: {
  page: number;
  pageSize: number;
  query?: string;
}) {
  const { page, pageSize, query } = params;
  await requireAccess("customer", "read");
  const skip = (page - 1) * pageSize;

  const where: any = query
    ? {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
    total,
  };
}

export async function createCustomer(formData: FormData) {
  await requireAccess("customer", "create");
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  const validated = CreateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    throw new Error("Invalid input");
  }

  const { name, email, phone, address } = validated.data;

  // Create using prisma with explicit id using cuid() is easier if prisma doesn't auto-gen,
  // but looking at schema, we used `id String @id` only, no default(cuid()).
  // Wait, I should have added @default(cuid()) to schema if I wanted auto-gen.
  // Let me check schema again. I used `@id` only.
  // Prisma usually requires `@default(cuid())` or `@default(uuid())` for auto-generation on create.
  // Or I can generate it here.
  // I'll use `cuid` library or just let prisma handle it if I update schema.
  // Actually, standard practice with Prisma + simple string ID is to use `@default(cuid())` in schema.
  // I might have missed that in previous step.
  // Let's assume I need to provide ID or update schema.
  // I'll check schema again in next step. For now I will assume I need to generate ID or update schema.
  // To be safe, I will update schema to include `@default(cuid())` in a correction step if needed.
  // But for now, let's use `crypto.randomUUID()` or similar if needed, or rely on db default if I added it.
  // Wait, the `replace_file_content` I did: `id String @id`. It didn't have default.
  // I should update schema to `id String @id @default(cuid())`.

  const customer = await prisma.customer.create({
    data: {
      id: crypto.randomUUID(), // Fallback if no default
      name,
      email,
      phone,
      address,
    },
  });

  await logAudit({
    action: "CREATE",
    entity: "Customer",
    entityId: customer.id,
    details: { name, email },
  });

  revalidatePath("/customers");
}

export async function updateCustomer(params: {
  id: string;
  formData: FormData;
}) {
  const { id, formData } = params;
  await requireAccess("customer", "update");

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  const validated = UpdateCustomerSchema.safeParse(rawData);
  if (!validated.success) throw new Error("Invalid input");

  const { name, email, phone, address } = validated.data;

  await prisma.customer.update({
    where: { id },
    data: { name, email, phone, address },
  });

  await logAudit({
    action: "UPDATE",
    entity: "Customer",
    entityId: id,
    details: { name, email },
  });

  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  await requireAccess("customer", "delete");
  await prisma.customer.delete({ where: { id } });

  await logAudit({
    action: "DELETE",
    entity: "Customer",
    entityId: id,
  });

  revalidatePath("/customers");
}

export async function deleteCustomers(ids: string[]) {
  await requireAccess("customer", "delete");
  await prisma.customer.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  // Log audit for each? or bulk?
  // Simply log one bulk entry or loop.
  // For simplicity, let's log individual or just one.
  // Let's log one "BULK_DELETE" or loop.
  // Given previous pattern, I'll just log "DELETE" for the batch.

  await logAudit({
    action: "DELETE",
    entity: "Customer",
    entityId: "BULK",
    details: { count: ids.length, ids },
  });

  revalidatePath("/customers");
}
