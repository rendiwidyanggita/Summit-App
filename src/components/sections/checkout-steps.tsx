"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const checkoutSteps = ["Alamat", "Kurir", "Voucher", "Pembayaran", "Ringkasan"] as const;

export type CheckoutStep = (typeof checkoutSteps)[number];

export function CheckoutSteps({ activeStep, onStepChange }: { activeStep: CheckoutStep; onStepChange: (step: CheckoutStep) => void }) {
  const activeIndex = checkoutSteps.indexOf(activeStep);

  return (
    <div className="overflow-x-auto rounded-full border bg-card p-2 shadow-sm">
      <div className="flex min-w-max items-center gap-2">
        {checkoutSteps.map((step, index) => {
          const complete = index < activeIndex;
          const active = step === activeStep;

          return (
            <button
              key={step}
              type="button"
              onClick={() => onStepChange(step)}
              aria-current={active ? "step" : undefined}
              aria-label={`Buka langkah checkout ${step}`}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                active && "bg-primary text-primary-foreground",
                complete && !active && "bg-secondary text-foreground",
              )}
            >
              <span className={cn("grid size-6 place-items-center rounded-full bg-background text-xs text-foreground", active && "bg-primary-foreground text-primary")}>
                {complete ? <Check className="size-3.5" /> : index + 1}
              </span>
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}
