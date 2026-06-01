"use client";

import { MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AccountAddressResponse, ShippingRatesResponse } from "@/lib/commerce-types";
import { cn } from "@/lib/utils";

export function AddressSelector({
  addresses,
  selectedAddressId,
  shippingAddress,
  onSelect,
}: {
  addresses: AccountAddressResponse[];
  selectedAddressId: string;
  shippingAddress?: ShippingRatesResponse["address"] | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {addresses.map((address) => {
        const active = selectedAddressId === address.id;
        const codSupported = active ? shippingAddress?.codSupported : undefined;

        return (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address.id)}
            aria-pressed={active}
            aria-label={`Pilih alamat ${address.label}`}
            className={cn("rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary", active && "border-primary ring-2 ring-primary/15")}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="size-4 text-primary" />
                  {address.label}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{address.recipient}</div>
              </div>
              <div className="flex gap-2">
                {address.isPrimary ? <Badge>Utama</Badge> : null}
                {codSupported !== undefined ? <Badge variant={codSupported ? "secondary" : "outline"}>{codSupported ? "COD OK" : "COD off"}</Badge> : null}
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{address.fullAddress}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              {address.phone} - {address.city}, {address.postalCode}
            </div>
          </button>
        );
      })}
    </div>
  );
}
