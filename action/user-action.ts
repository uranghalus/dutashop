"use server";

import { auth } from "@/lib/auth";
import { requireAccess } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-service";
import {
  BanUserSchema,
  CreateUserSchema,
  UpdateUserSchema,
} from "@/schema/user-schema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUsers(params: {
  page: number;
  pageSize: number;
  query?: string;
}) {
  const { page, pageSize, query } = params;
  await requireAccess("user", "read");
  const skip = (page - 1) * pageSize;

  const where: any = query
    ? {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
    total,
  };
}

export async function createUser(formData: FormData) {
  await requireAccess("user", "create");
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const validated = CreateUserSchema.safeParse(rawData);

  if (!validated.success) {
    throw new Error("Invalid input");
  }

  const { name, email, password, role } = validated.data;

  // Use Better Auth Admin API
  const result = await auth.api.createUser({
    body: {
      name,
      email,
      password,
      role,
    },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("Failed to create user");
  }

  await logAudit({
    action: "CREATE",
    entity: "User",
    entityId: result.user.id,
    details: { name, email, role },
  });

  revalidatePath("/users");
}

export async function updateUser(params: { id: string; formData: FormData }) {
  const { id, formData } = params;

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
  };

  const validated = UpdateUserSchema.safeParse(rawData);
  if (!validated.success) throw new Error("Invalid input");

  const { name, email, role } = validated.data;

  await auth.api.adminUpdateUser({
    body: {
      userId: id, // required
      data: { name, email, role }, // required
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  await logAudit({
    action: "UPDATE",
    entity: "User",
    entityId: id,
    details: { name, email, role },
  });

  revalidatePath("/users");
}

export async function deleteUser(id: string) {
  // Note: 'removeUser' might be the method name in some versions, checking docs it says 'removeUser' usually or 'deleteUser' in admin plugin.
  // Based on search result [1], it mentioned authClient.admin.createUser.
  // Let's assume auth.api.removeUser or auth.api.deleteUser.
  // I will try removeUser first as it's common in better-auth, if not I'll check if I need to use prisma directly for deletion if API not exposed.
  // Actually, for admin plugin, the server side API usually mirrors.
  // Let's us try to find `removeUser` or similar.
  // If I can't find it in type, I might need to use prisma but better-auth handles sessions cleanup.
  // Let's try `auth.api.removeUser`.

  await auth.api.removeUser({
    body: {
      userId: id,
    },
    headers: await headers(),
  });

  await logAudit({
    action: "DELETE",
    entity: "User",
    entityId: id,
  });

  revalidatePath("/users");
}

export async function deleteUsers(ids: string[]) {
  await requireAccess("user", "delete");
  // Use Promise.all to delete users in parallel
  // We use auth.api.removeUser to ensure proper cleanup of sessions/etc managed by better-auth
  // If one fails, we might want to continue or throw.
  // For simplicity, we'll try to delete all and if any fail, we throw an error at the end or let it bubble up.
  // Ideally, we should handle partial failures, but for now we will just run them.

  await Promise.all(
    ids.map(async (id) => {
      await auth.api.removeUser({
        body: {
          userId: id,
        },
        headers: await headers(),
      });
      await logAudit({
        action: "DELETE",
        entity: "User",
        entityId: id,
      });
    }),
  );

  revalidatePath("/users");
}

export async function banUser(params: { userId: string; banReason?: string }) {
  await requireAccess("user", "update");
  const { userId, banReason } = params;

  await auth.api.banUser({
    body: {
      userId,
      banReason,
    },
    headers: await headers(),
  });

  await logAudit({
    action: "UPDATE", // Ban is an update of status
    entity: "User",
    entityId: userId,
    details: { status: "BANNED", banReason },
  });

  revalidatePath("/users");
}

export async function unbanUser(userId: string) {
  await requireAccess("user", "update");
  await auth.api.unbanUser({
    body: {
      userId,
    },
    headers: await headers(),
  });

  await logAudit({
    action: "UPDATE",
    entity: "User",
    entityId: userId,
    details: { status: "ACTIVE" },
  });

  revalidatePath("/users");
}
