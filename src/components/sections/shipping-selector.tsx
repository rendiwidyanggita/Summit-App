"use client";

import { Clock, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ShippingServiceMock } from "@/lib/commerce-mock";
import { formatRupiah, cn } from "@/lib/utils";

export function ShippingSelector({
  services,
  selectedServiceId,
  onSelect,
}: {
  services: ShippingServiceMock[];
  selectedServiceId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {services.map((service) => {
        const active = selectedServiceId === service.id;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
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
