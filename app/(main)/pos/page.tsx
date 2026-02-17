"use client";

import { Main } from "@/components/main";
import React, { useState } from "react";
import { ProductGrid } from "./component/product-grid";

import { useProducts } from "@/hooks/crud/use-product";
import { CartItem } from "@/action/pos-action";
import { CartSummary } from "./component/cart-summary";

export default function POSPage() {
  const { data: productData, isLoading } = useProducts({
    page: 0,
    pageSize: 100,
  });
  const products = productData?.data ?? [];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          price:
            typeof product.price === "number"
              ? product.price
              : parseFloat(product.price.toString()),
          name: product.name, // Keep name for UI display
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => setCart([]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Main
      fluid
      className="flex flex-col h-[calc(100vh-4rem)] md:flex-row gap-4 p-4 overflow-hidden"
    >
      {/* LEFT: Product Grid */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto">
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
            loading={isLoading}
          />
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div className="w-full md:w-96 flex flex-col bg-card border rounded-md shadow-sm overflow-hidden">
        <CartSummary
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
        />
      </div>
    </Main>
  );
}
