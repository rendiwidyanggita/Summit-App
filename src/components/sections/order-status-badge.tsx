import { Badge } from "@/components/ui/badge";
import { getOrderStatusLabel, getPaymentStatusLabel, type OrderStatusMock, type PaymentStatusMock } from "@/lib/order-mock";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({ status, className }: { status: OrderStatusMock; className?: string }) {
  const tone: Record<OrderStatusMock, string> = {
    PENDING_PAYMENT: "border-accent/40 bg-accent/15 text-accent-foreground",
    PROCESSING: "border-primary/30 bg-primary/10 text-primary",
    SHIPPED: "border-blue-500/30 bg-blue-500/10 text-blue-700",
    COMPLETED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    CANCELLED: "border-destructive/30 bg-destructive/10 text-destructive",
  };

  return (
    <Badge variant="outline" className={cn(tone[status], className)}>
      {getOrderStatusLabel(status)}
    </Badge>
  );
}

export function PaymentStatusBadge({ status, className }: { status: PaymentStatusMock; className?: string }) {
  const tone: Record<PaymentStatusMock, string> = {
    PENDING: "border-accent/40 bg-accent/15 text-accent-foreground",
    PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
    EXPIRED: "border-muted-foreground/30 bg-secondary text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={cn(tone[status], className)}>
      {getPaymentStatusLabel(status)}
    </Badge>
  );
}
