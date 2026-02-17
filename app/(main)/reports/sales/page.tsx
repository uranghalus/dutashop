"use client";

import { Main } from "@/components/main";
import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  RiPrinterLine,
  RiFilePdfLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
} from "@remixicon/react";
import React, { useState, useEffect, useRef } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { getTransactions } from "@/action/history-action";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SalesReportPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["transactions-report", date],
    queryFn: () =>
      getTransactions({
        page: 0,
        pageSize: 1000, // Fetch large number for report (pagination might be better for huge datasets but for reporting we usually want all)
        from: date?.from,
        to: date?.to,
      }),
    enabled: !!date?.from,
  });

  const transactions = transactionsData?.data || [];
  const totalSales = transactions.reduce((acc, curr) => acc + curr.total, 0);
  const totalTransactions = transactions.length;
  const avgTransactionValue =
    totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Sales Report", 14, 22);

    doc.setFontSize(11);
    doc.text(
      `Period: ${date?.from ? format(date.from, "dd MMM yyyy") : ""} - ${date?.to ? format(date.to, "dd MMM yyyy") : ""}`,
      14,
      30,
    );

    doc.text(
      `Total Sales: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalSales)}`,
      14,
      40,
    );
    doc.text(`Total Transactions: ${totalTransactions}`, 14, 46);

    const tableColumn = [
      "Date",
      "Transaction ID",
      "Customer",
      "Cashier",
      "Items",
      "Total",
    ];
    const tableRows: any[] = [];

    transactions.forEach((tx) => {
      const rowData = [
        format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm"),
        tx.id.slice(0, 8) + "...",
        tx.customer?.name || "Guest",
        tx.cashier.name,
        tx.items.length,
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(tx.total),
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
    });

    doc.save(`sales-report-${format(new Date(), "yyyyMMddHHmmss")}.pdf`);
    toast.success("PDF exported successfully!");
  };

  return (
    <Main fluid className="space-y-6 print:space-y-2 print:p-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold">Laporan Penjualan</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export sales reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker date={date} setDate={setDate} />
          <Button variant="outline" onClick={handlePrint}>
            <RiPrinterLine className="size-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExportPDF}>
            <RiFilePdfLine className="size-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 print:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <RiMoneyDollarCircleLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <RiShoppingCartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Value</CardTitle>
            <RiFileList3Line className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(avgTransactionValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <div className="border rounded-md bg-white print:border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions found for this period.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {format(new Date(tx.createdAt), "dd MMM yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {tx.customer?.name || (
                      <span className="text-muted-foreground italic">
                        Guest
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{tx.cashier.name}</TableCell>
                  <TableCell className="text-right">
                    {tx.items.length}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(tx.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Print Footer (Visible only in print) */}
      <div className="hidden print:block mt-8 text-center text-sm text-muted-foreground">
        Generated on {format(new Date(), "dd MMM yyyy HH:mm")} by E-Shop System
      </div>
    </Main>
  );
}
