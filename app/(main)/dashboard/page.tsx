import { Main } from "@/components/main";
import React from "react";
import { getDashboardStats } from "@/action/dashboard-action";
import { OverviewCards } from "./component/overview-cards";
import { RecentSales } from "./component/recent-sales";
import { OverviewChart } from "./component/overview-chart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <Main fluid className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your business performance.
        </p>
      </div>

      <OverviewCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OverviewChart data={stats.chartData} />
        <div className="col-span-3">
          <RecentSales sales={stats.recentSales} />
        </div>
      </div>
    </Main>
  );
}
