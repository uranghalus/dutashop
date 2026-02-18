import { requireAccess } from "@/lib/auth-guard";
import UsersClientPage from "./client-page";

export default async function UsersPage() {
  await requireAccess("user", "read");

  return <UsersClientPage />;
}
