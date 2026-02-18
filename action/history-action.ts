"use server";

import { requireAccess } from "@/lib/auth-guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTransactions(params: {
  page: number;
  pageSize: number;
  query?: string;
  from?: Date;
  to?: Date;
}) {
  const { page, pageSize, query, from, to } = params;
  await requireAccess("report", "read"); // or transaction read? User said "view product lists, input customer data, generate sales reports". Transactions list is likely a report or sales history.
  // I will use 'transaction' read for history.
  // Wait, user said "generate sales reports" -> likely dashboard/reports.
  // Sales History is also a report/list of transactions.
  // I'll use 'transaction' 'read'.
  await requireAccess("transaction", "read");
  const skip = page * pageSize;

  const where: any = {
    AND: [],
  };

  if (query) {
    where.AND.push({
      OR: [
        { id: { contains: query } },
        {
          customer: {
            name: { contains: query },
          },
        },
      ],
    });
  }

  if (from || to) {
    where.AND.push({
      createdAt: {
        gte: from,
        lte: to ? new Date(to.setHours(23, 59, 59, 999)) : undefined,
      },
    });
  }

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        cashier: true,
        customer: true, // Add customer relation
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  // Convert Decimals to numbers for client safety
  const formattedData = data.map((tx) => ({
    ...tx,
    total: tx.total.toNumber(),
    items: tx.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    })),
  }));

  return {
    data: formattedData,
    pageCount: Math.ceil(total / pageSize),
    total,
  };
}

export async function getTransaction(id: string) {
  await requireAccess("transaction", "read");
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      cashier: true,
      customer: true, // Add customer relation
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!transaction) return null;

  return {
    ...transaction,
    total: transaction.total.toNumber(),
    items: transaction.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    })),
  };
}
