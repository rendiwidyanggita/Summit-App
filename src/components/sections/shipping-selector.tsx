"use client";

import { Clock, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ShippingServiceResponse } from "@/lib/commerce-types";
import { formatRupiah, cn } from "@/lib/utils";

export function ShippingSelector({
  services,
  selectedServiceId,
  loading,
  onSelect,
}: {
  services: ShippingServiceResponse[];
  selectedServiceId: string;
  loading?: boolean;
  onSelect: (id: string) => void;
}) {
  if (loading) {
    return <div className="rounded-lg border bg-secondary p-4 text-sm text-muted-foreground">Menghitung estimasi ongkos kirim...</div>;
  }

  if (services.length === 0) {
    return <div className="rounded-lg border bg-secondary p-4 text-sm text-muted-foreground">Pilih alamat untuk melihat layanan kurir.</div>;
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-xs text-muted-foreground">
        Tarif dan estimasi pengiriman dapat berubah sewaktu-waktu sesuai dengan kebijakan layanan ekspedisi yang berlaku.
      </div>
      {services.map((service) => {
        const active = selectedServiceId === service.id;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            aria-pressed={active}
            aria-label={`Pilih kurir ${service.courier} ${service.service}`}
            className={cn("rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary", active && "border-primary ring-2 ring-primary/15")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <Truck className="size-4 text-primary" />
                  {service.courier} {service.service}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Estimasi {service.estimate}
                </div>
              </div>
              <Badge variant="accent">{formatRupiah(service.price)}</Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
