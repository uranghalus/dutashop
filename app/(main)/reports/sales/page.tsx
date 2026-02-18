import { requireAccess } from "@/lib/auth-guard";
import SalesReportPage from "./client-page";

export default async function Page() {
  await requireAccess("report", "read");

  return <SalesReportPage />;
}
