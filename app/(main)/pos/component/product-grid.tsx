import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiAddLine } from "@remixicon/react";

type Props = {
  products: any[];
  onAddToCart: (product: any) => void;
  loading: boolean;
};

export function ProductGrid({ products, onAddToCart, loading }: Props) {
  if (loading) return <div>Loading products...</div>;
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
      {products.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer hover:border-primary transition-colors flex flex-col justify-between"
          onClick={() => onAddToCart(product)}
        >
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {product.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-bold text-lg">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(product.price))}
            </div>
            <div className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Button size="sm" className="w-full" variant="secondary">
              <RiAddLine className="size-4 mr-1" /> Add
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
