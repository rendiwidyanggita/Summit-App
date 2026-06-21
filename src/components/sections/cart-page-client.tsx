"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, PackageX, ShieldCheck, ShoppingBag, TicketPercent, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { CartItemRow } from "@/components/sections/cart-item-row";
import { DesignParticles } from "@/components/sections/design-particles";
import { OrderSummary } from "@/components/sections/order-summary";
import { RouteStatePanel } from "@/components/sections/route-state-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import type { CartResponse } from "@/lib/commerce-types";

export function CartPageClient() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  async function loadCart() {
    try {
      const data = await apiRequest<CartResponse>("/api/cart");
      setCart(data);
      setSelectedItemIds(new Set(data.items.map((i) => i.id)));
      setUnauthenticated(false);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        setUnauthenticated(true);
        setCart(null);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Gagal memuat keranjang.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCart();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function updateQuantity(id: string, quantity: number) {
    setBusyItemId(id);
    try {
      const data = await apiRequest<CartResponse>(`/api/cart/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setCart(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Quantity gagal diperbarui.");
    } finally {
      setBusyItemId(null);
    }
  }

  async function removeItem(id: string) {
    setBusyItemId(id);
    try {
      const data = await apiRequest<CartResponse>(`/api/cart/items/${id}`, {
        method: "DELETE",
      });
      setCart(data);
      toast.success("Item dihapus dari keranjang.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Item gagal dihapus.");
    } finally {
      setBusyItemId(null);
    }
  }

  async function clearCart() {
    setClearing(true);
    try {
      const data = await apiRequest<CartResponse>("/api/cart", {
        method: "DELETE",
      });
      setCart(data);
      toast.success("Keranjang dikosongkan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Keranjang gagal dikosongkan.");
    } finally {
      setClearing(false);
    }
  }

  function handleSelect(id: string, checked: boolean) {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function handleSelectAll(checked: boolean) {
    if (checked && cart) setSelectedItemIds(new Set(cart.items.map((i) => i.id)));
    else setSelectedItemIds(new Set());
  }

  const selectedItems = cart?.items.filter((item) => selectedItemIds.has(item.id)) ?? [];
  const selectedSubtotal = selectedItems.reduce((acc, item) => acc + item.lineSubtotal, 0);
  const selectedWeight = selectedItems.reduce((acc, item) => acc + (item.product.weightGram * item.quantity), 0);
  const selectedQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredCart: CartResponse | null = cart ? {
    ...cart,
    items: selectedItems,
    summary: {
      itemCount: selectedItems.length,
      totalQuantity: selectedQuantity,
      subtotal: selectedSubtotal,
      totalWeightGram: selectedWeight,
    }
  } : null;

  if (loading) {
    return (
      <div className="container-page py-8">
        <RouteStatePanel icon={Loader2} eyebrow="Keranjang" title="Memuat keranjang" description="Mengambil item cart dari backend." />
      </div>
    );
  }

  if (unauthenticated) {
    return (
      <div className="container-page py-8">
        <RouteStatePanel
          icon={ShoppingBag}
          eyebrow="Keranjang"
          title="Masuk untuk melihat keranjang"
          description="Keranjang disimpan per akun agar checkout, voucher, dan reserved stock divalidasi backend."
          actions={
            <Button asChild>
              <Link href="/masuk?callbackUrl=/keranjang">Masuk</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-page py-8">
        <RouteStatePanel
          icon={PackageX}
          eyebrow="Keranjang"
          title="Keranjang kosong"
          description="Pilih produk dan varian dari katalog untuk mulai checkout."
          actions={
            <Button asChild>
              <Link href="/produk">Lihat produk</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <section className="summit-dark relative mb-6 overflow-hidden rounded-xl border border-white/10">
        <DesignParticles />
        <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="accent">Shopping Cart</Badge>
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Keranjang Pendakian</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Review item, sesuaikan quantity, cek estimasi berat, lalu lanjut ke checkout yang sudah terhubung backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm lg:max-w-sm">
            <span className="rounded-full bg-white/12 px-3 py-2">Cart API</span>
            <span className="rounded-full bg-white/12 px-3 py-2">Voucher aktif</span>
            <span className="rounded-full bg-white/12 px-3 py-2">Ongkir backend</span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          <div className="flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              className="size-5 cursor-pointer accent-primary" 
              checked={cart.items.length > 0 && selectedItemIds.size === cart.items.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="text-sm font-medium">Pilih Semua ({cart.items.length})</span>
          </div>
          {cart.items.map((item) => (
            <CartItemRow 
              key={item.id} 
              item={item} 
              busy={busyItemId === item.id} 
              selected={selectedItemIds.has(item.id)}
              onSelect={handleSelect}
              onQuantityChange={updateQuantity} 
              onRemove={removeItem} 
            />
          ))}
          <div className="grid gap-3 rounded-xl border bg-white p-4 text-sm sm:grid-cols-3">
            {[
              { icon: TicketPercent, text: "Voucher divalidasi server saat checkout." },
              { icon: Truck, text: "Ongkir dihitung dari berat cart dan alamat." },
              { icon: ShieldCheck, text: "Reserved stock dibuat saat order checkout." },
            ].map((item) => (
              <div key={item.text} className="flex gap-3">
                <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          {filteredCart && (
            <OrderSummary
              cart={filteredCart}
              action={
                <Button asChild disabled={selectedItemIds.size === 0}>
                  <Link href={`/checkout?items=${Array.from(selectedItemIds).join(",")}`}>
                    Lanjut checkout <ArrowRight />
                  </Link>
                </Button>
              }
            />
          )}
          <Button variant="outline" className="mt-3 w-full" asChild>
            <Link href="/produk">
              <ShoppingBag /> Tambah gear lain
            </Link>
          </Button>
          <Button type="button" variant="ghost" className="mt-2 w-full" onClick={clearCart} disabled={clearing}>
            {clearing ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Kosongkan keranjang
          </Button>
        </aside>
      </div>
    </div>
  );
}
