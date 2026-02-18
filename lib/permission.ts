import { auth } from "./auth";

type PermissionPayload = Record<string, string[]>;

export type Role = "admin" | "user" | "cashier";

export async function checkPermission({
  userId,
  role,
  permission,
}: {
  userId: string;
  role: Role;
  permission: PermissionPayload;
}) {
  const result = await auth.api.userHasPermission({
    body: {
      userId,
      role,
      permission,
    },
  });

  return result.success ?? false;
}
