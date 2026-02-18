import { requireAccess } from "@/lib/auth-guard";
import AuditLogsClientPage from "./client-page";

export default async function AuditLogsPage() {
  await requireAccess("user", "read"); // Using "user" permission as proxy for Admin access

  return <AuditLogsClientPage />;
}
