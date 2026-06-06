import { PackageCheck, Scale, TicketPercent, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartResponse } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

export function OrderSummary({
  cart,
  shippingCost = 0,
  discount = 0,
  action,
}: {
  cart: CartResponse;
  shippingCost?: number;
  discount?: number;
  action?: React.ReactNode;
}) {
  const total = cart.summary.subtotal + shippingCost - discount;

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-primary" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          Ringkasan Pesanan
          <Badge variant="secondary">{cart.summary.totalQuantity} item</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <PackageCheck className="size-4" /> Subtotal
            </span>
            <span className="font-medium">{formatRupiah(cart.summary.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Scale className="size-4" /> Estimasi berat
            </span>
            <span className="font-medium">{(cart.summary.totalWeightGram / 1000).toFixed(2)} kg</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4" /> Ongkir
            </span>
            <span className="font-medium">{shippingCost ? formatRupiah(shippingCost) : "Pilih kurir"}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <TicketPercent className="size-4" /> Voucher
            </span>
            <span className="font-medium">{discount ? `-${formatRupiah(discount)}` : "-"}</span>
          </div>
        </div>
        <div className="rounded-md bg-secondary p-4">
          <div className="text-sm text-muted-foreground">Total pembayaran</div>
          <div className="mt-1 text-2xl font-semibold">{formatRupiah(total)}</div>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
