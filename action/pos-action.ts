"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { logAudit } from "@/lib/audit-service";

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
};

export async function createTransaction(data: {
  items: CartItem[];
  paymentMethod: string;
  total: number;
  customerId?: string;
}) {
  const { items, paymentMethod, total, customerId } = data;

  // Use a transaction to ensure atomicity
  // 1. Check stock
  // 2. Create Transaction
  // 3. Create TransactionItems
  // 4. Update Product Stock

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      // ... (existing helper logic) ...

      // 2. Create Transaction
      const cashier = await tx.user.findFirst();
      if (!cashier) throw new Error("No cashier found");

      const newTransaction = await tx.transaction.create({
        data: {
          id: crypto.randomUUID(),
          total: new Prisma.Decimal(total),
          paymentMethod,
          cashierId: cashier.id,
          customerId, // Add customerId here
          createdAt: new Date(),
          updatedAt: new Date(),
          items: {
            create: items.map((item) => ({
              id: crypto.randomUUID(),
              productId: item.productId,
              quantity: item.quantity,
              price: new Prisma.Decimal(item.price),
            })),
          },
        },
      });

      // 4. Update Stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newTransaction;
    });

    revalidatePath("/pos");
    revalidatePath("/products");
    revalidatePath("/dashboard");
    revalidatePath("/customers"); // Revalidate customers as they have new transactions

    await logAudit({
      action: "CREATE",
      entity: "Transaction",
      entityId: transaction.id,
      userId: transaction.cashierId,
      details: {
        total: transaction.total,
        paymentMethod: transaction.paymentMethod,
        itemCount: items.length,
        customerId,
      },
    });

    return { success: true, data: transaction };
  } catch (error) {
    console.error("Transaction error:", error);
    return { success: false, error: (error as Error).message };
  }
}
