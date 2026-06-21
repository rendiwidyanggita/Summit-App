"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { apiRequest } from "@/lib/api-client";
import { formatRupiah } from "@/lib/utils";

type CartItemPreview = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  productImage: string;
};

type CartPreview = {
  items: CartItemPreview[];
  summary: { totalItems: number; subtotal: number };
};

export function CartNavPopover() {
  const [cart, setCart] = useState<CartPreview | null>(null);

  useEffect(() => {
    // Memanggil API cart dengan background polling ringan atau event listener
    const fetchCart = async () => {
      try {
        // Kita perlu memastikan endpoint ini ada atau bisa mengembalikan preview
        // Asumsi /api/cart mengembalikan struktur keranjang lengkap
        const data = await apiRequest<any>("/api/cart");
        if (data && data.items) {
          const items = data.items.map((item: any) => ({
            id: item.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: Number(item.product.discountPrice ?? item.product.price) + Number(item.variant?.priceModifier ?? 0),
            productImage: item.product.photos[0] ?? "",
          }));
          setCart({
            items,
            summary: {
              totalItems: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
              subtotal: items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0),
            }
          });
        }
      } catch (error) {
        // Abaikan jika tidak login
      }
    };

    fetchCart();
    
    // Opsional: dengarkan event kustom untuk update keranjang
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  return (
    <HoverCard openDelay={200} closeDelay={300}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Keranjang" asChild className="relative">
          <Link href="/keranjang">
            <ShoppingCart />
            {cart && cart.summary.totalItems > 0 && (
              <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {cart.summary.totalItems}
              </span>
            )}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-sm">Keranjang Belanja</h4>
          <span className="text-xs text-muted-foreground">{cart?.summary.totalItems ?? 0} Barang</span>
        </div>
        
        <div className="grid max-h-[300px] gap-2 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">Keranjang Anda kosong.</div>
          ) : (
            cart.items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative size-12 shrink-0 overflow-hidden rounded bg-secondary">
                  {item.productImage && <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="48px" />}
                </div>
                <div className="grid flex-1 gap-1">
                  <div className="line-clamp-1 text-sm font-medium">{item.productName}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.quantity} x {formatRupiah(item.unitPrice)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart && cart.items.length > 0 && (
          <div className="border-t bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-sm font-bold text-primary">{formatRupiah(cart.summary.subtotal)}</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/keranjang">Lihat Keranjang Lengkap</Link>
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
