import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPermission, type Role } from "@/lib/permission";

export async function requireAccess(
  resource: string,
  action: "create" | "read" | "update" | "delete",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const role = (session.user.role || "user") as Role;

  const permission = {
    [resource]: [action],
  };

  const hasPermission = await checkPermission({
    userId: session.user.id,
    role,
    permission,
  });

  if (!hasPermission) {
    throw new Error(
      `Unauthorized: User with role ${role} cannot ${action} ${resource}`,
    );
  }

  return session;
}
