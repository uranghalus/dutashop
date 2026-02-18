"use server";

import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/auth-guard";

export async function getDashboardStats() {
  await requireAccess("report", "read");
  // 1. Total Revenue
  const revenueResult = await prisma.transaction.aggregate({
    _sum: {
      total: true,
    },
  });
  const totalRevenue = revenueResult._sum.total?.toNumber() ?? 0;

  // 2. Total Transactions
  const totalTransactions = await prisma.transaction.count();

  // 3. Low Stock Items (Threshold: 5)
  const lowStockCount = await prisma.product.count({
    where: {
      stock: {
        lte: 5,
      },
    },
  });

  // 4. Recent Sales
  const recentSales = await prisma.transaction.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      cashier: true,
    },
  });

  // Format recent sales
  const formattedRecentSales = recentSales.map((sale) => ({
    id: sale.id,
    total: sale.total.toNumber(),
    cashierName: sale.cashier?.name ?? "Unknown",
    createdAt: sale.createdAt,
  }));

  // 5. Daily Revenue (Last 7 Days)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyRevenueData = await prisma.transaction.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    _sum: {
      total: true,
    },
  });

  // Map database results to a standard efficient array (fill missing days)
  const dailyRevenueMap = new Map<string, number>();
  dailyRevenueData.forEach((item) => {
    // Use Local Time for grouping
    const d = new Date(item.createdAt);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const amount = item._sum.total?.toNumber() ?? 0;
    const currentAmount = dailyRevenueMap.get(dateKey) ?? 0;
    dailyRevenueMap.set(dateKey, currentAmount + amount);
  });

  const chartData = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    // Format for display (e.g., "Mon" or "15 Feb")
    const displayDate = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    chartData.push({
      name: displayDate,
      total: dailyRevenueMap.get(dateKey) ?? 0,
    });
  }

  return {
    totalRevenue,
    totalTransactions,
    lowStockCount,
    recentSales: formattedRecentSales,
    chartData,
  };
}
