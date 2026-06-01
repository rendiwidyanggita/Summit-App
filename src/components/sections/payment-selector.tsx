"use client";

import { CreditCard, QrCode, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CheckoutPaymentMethod } from "@/lib/commerce-types";
import { cn, formatRupiah } from "@/lib/utils";

export type PaymentMethodOption = {
  id: CheckoutPaymentMethod;
  label: string;
  description: string;
  group: "Midtrans" | "COD";
};

function PaymentIcon({ id }: { id: CheckoutPaymentMethod }) {
  if (id === "MIDTRANS_QRIS") {
    return <QrCode className="size-4 text-primary" />;
  }

  if (id === "MIDTRANS_EWALLET" || id === "COD") {
    return <Wallet className="size-4 text-primary" />;
  }

  return <CreditCard className="size-4 text-primary" />;
}

export function PaymentSelector({
  methods,
  selectedMethodId,
  onSelect,
  total,
  codSupported,
}: {
  methods: PaymentMethodOption[];
  selectedMethodId: CheckoutPaymentMethod;
  onSelect: (id: CheckoutPaymentMethod) => void;
  total: number;
  codSupported: boolean;
}) {
  return (
    <div className="grid gap-3">
      {methods.map((method) => {
        const codBlocked = method.id === "COD" && (total > 1500000 || !codSupported);
        const active = selectedMethodId === method.id;

        return (
          <button
            key={method.id}
            type="button"
            disabled={codBlocked}
            onClick={() => onSelect(method.id)}
            aria-pressed={active}
            aria-label={`Pilih metode pembayaran ${method.label}`}
            className={cn(
              "rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-55",
              active && "border-primary ring-2 ring-primary/15",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <PaymentIcon id={method.id} />
                  {method.label}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{method.description}</p>
                {codBlocked ? <p className="mt-2 text-xs font-medium text-destructive">COD tidak tersedia: limit {formatRupiah(1500000)} atau wilayah belum didukung.</p> : null}
              </div>
              <Badge variant={method.group === "COD" ? "outline" : "secondary"}>{method.group}</Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
