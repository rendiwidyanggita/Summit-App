import { notFound } from "next/navigation";

import { PaymentStatusView } from "@/components/sections/payment-status-view";
import { getOrderById } from "@/lib/order-mock";

export const metadata = {
  title: "Status Pembayaran",
};

export default async function PaymentStatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <PaymentStatusView order={order} />;
}
