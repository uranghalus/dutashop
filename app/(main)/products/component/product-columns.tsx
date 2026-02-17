"use client";

import { ColumnDef } from "@tanstack/react-table";
import { product, category } from "@/generated/prisma/client";
import { ProductRowActions } from "./product-row-actions";

type ProductWithCategory = Omit<product, "price"> & {
  price: number;
  category: category;
};

export const productColumns: ColumnDef<ProductWithCategory>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductRowActions<ProductWithCategory> row={row} />,
  },
];
