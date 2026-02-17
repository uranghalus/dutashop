import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Sale = {
  id: string;
  total: number;
  cashierName: string;
  createdAt: Date;
};

type Props = {
  sales: Sale[];
};

export function RecentSales({ sales }: Props) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No recent sales
            </div>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {sale.cashierName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.cashierName}
                  </p>
                  <p className="text-xs text-muted-foreground text-nowrap w-[150px] truncate">
                    ID: {sale.id}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(sale.total)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
