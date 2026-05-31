import { notFound } from "next/navigation";

import { OrderDetailView } from "@/components/sections/order-detail-view";
import { getOrderById } from "@/lib/order-mock";

export const metadata = {
  title: "Detail Pesanan",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
