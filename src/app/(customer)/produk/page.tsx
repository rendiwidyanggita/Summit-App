import { SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { featuredProducts } from "@/lib/constants";

export default function ProductsPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <Badge variant="secondary">Katalog</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">Produk Pendakian</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Grid produk responsive dengan filter placeholder. Query database, search, dan pagination masuk Sprint 3.</p>
      </div>
      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_auto]">
          <Input placeholder="Cari produk..." />
          <Button variant="outline" disabled>
            <SlidersHorizontal /> Filter Sprint 3
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
