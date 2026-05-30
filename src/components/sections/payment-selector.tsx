"use client";

import { CreditCard, QrCode, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CheckoutAddressMock, PaymentMethodMock } from "@/lib/commerce-mock";
import { cn, formatRupiah } from "@/lib/utils";

function PaymentIcon({ id }: { id: string }) {
  if (id === "qris") {
    return <QrCode className="size-4 text-primary" />;
  }

  if (id === "ewallet" || id === "cod") {
    return <Wallet className="size-4 text-primary" />;
  }

  return <CreditCard className="size-4 text-primary" />;
}

export function PaymentSelector({
  methods,
  selectedMethodId,
  onSelect,
  total,
  address,
}: {
  methods: PaymentMethodMock[];
  selectedMethodId: string;
  onSelect: (id: string) => void;
  total: number;
  address: CheckoutAddressMock;
}) {
  return (
    <div className="grid gap-3">
      {methods.map((method) => {
        const codBlocked = method.id === "cod" && (total > 1500000 || !address.codSupported);
        const active = selectedMethodId === method.id;

        return (
          <button
            key={method.id}
            type="button"
            disabled={codBlocked}
            onClick={() => onSelect(method.id)}
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
