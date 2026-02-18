import { requireAccess } from "@/lib/auth-guard";
import CustomersClientPage from "./client-page";

export default async function CustomersPage() {
  await requireAccess("customer", "read");

  return <CustomersClientPage />;
}
