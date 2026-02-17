import { getTransaction } from "@/action/history-action";
import { notFound } from "next/navigation";
import PrintPageClient from "./print-client";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  const transaction = await getTransaction(transactionId);

  if (!transaction) {
    notFound();
  }

  return <PrintPageClient transaction={transaction} />;
}
