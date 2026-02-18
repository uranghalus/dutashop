import { requireAccess } from "@/lib/auth-guard";
import POSClientPage from "./client-page";

export default async function POSPage() {
  await requireAccess("transaction", "read"); // or create? read to access page is fine.

  return <POSClientPage />;
}
