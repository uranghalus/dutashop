import { requireAccess } from "@/lib/auth-guard";
import SalesHistoryClientPage from "./client-page";

export default async function SalesHistoryPage() {
  await requireAccess("transaction", "read");

  return <SalesHistoryClientPage />;
}
