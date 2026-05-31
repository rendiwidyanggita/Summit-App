import { CheckCircle2, Circle, Clock } from "lucide-react";

import { type OrderTimelineItemMock } from "@/lib/order-mock";
import { cn } from "@/lib/utils";

export function OrderTimeline({ items }: { items: OrderTimelineItemMock[] }) {
  return (
    <div className="grid gap-0">
      {items.map((item, index) => {
        const Icon = item.current ? Clock : item.complete ? CheckCircle2 : Circle;

        return (
          <div key={`${item.label}-${index}`} className="grid grid-cols-[2rem_1fr] gap-3">
            <div className="relative flex justify-center">
              <span
                className={cn(
                  "mt-1 grid size-8 place-items-center rounded-full border bg-background",
                  item.complete ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground",
                  item.current ? "border-accent bg-accent/15 text-accent-foreground" : undefined,
                )}
              >
                <Icon className="size-4" />
              </span>
              {index < items.length - 1 ? <span className={cn("absolute top-9 h-[calc(100%-1rem)] w-px", item.complete ? "bg-primary/40" : "bg-border")} /> : null}
            </div>
            <div className="pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{item.label}</h3>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
