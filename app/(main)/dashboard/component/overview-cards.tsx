import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiAlertLine,
} from "@remixicon/react";

type Props = {
  stats: {
    totalRevenue: number;
    totalTransactions: number;
    lowStockCount: number;
  };
};

export function OverviewCards({ stats }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <RiMoneyDollarCircleLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total lifetime revenue
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <RiShoppingCartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            Total transactions completed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Alerts
          </CardTitle>
          <RiAlertLine className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {stats.lowStockCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Products with stock &le; 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
