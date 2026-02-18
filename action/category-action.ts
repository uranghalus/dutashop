"use server";

import { requireAccess } from "@/lib/auth-guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { logAudit } from "@/lib/audit-service";
export async function getCategories({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const skip = page * pageSize;
  await requireAccess("category", "read");

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count(),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
  };
}
export async function createCategory(formData: FormData) {
  await requireAccess("category", "create");
  const name = formData.get("name") as string;
  const id = randomUUID();

  await prisma.category.create({
    data: {
      id,
      name,
      updatedAt: new Date(),
    },
  });

  await logAudit({
    action: "CREATE",
    entity: "Category",
    entityId: id,
    details: { name },
  });

  revalidatePath("/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAccess("category", "update");
  const name = formData.get("name") as string;

  await prisma.category.update({
    where: { id },
    data: {
      name,
      updatedAt: new Date(),
    },
  });

  await logAudit({
    action: "UPDATE",
    entity: "Category",
    entityId: id,
    details: { name },
  });

  revalidatePath("/categories");
}
export async function deleteCategory(id: string) {
  await requireAccess("category", "delete");
  await prisma.category.delete({
    where: { id },
  });

  await logAudit({
    action: "DELETE",
    entity: "Category",
    entityId: id,
  });

  revalidatePath("/categories");
}
/* ================================
   DELETE BULK
================================ */
export async function deleteCategoryBulk(ids: string[]) {
  await requireAccess("category", "delete");
  await prisma.category.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  await logAudit({
    action: "DELETE",
    entity: "Category",
    entityId: "BATCH",
    details: { count: ids.length, ids },
  });

  revalidatePath("/categories");
}
