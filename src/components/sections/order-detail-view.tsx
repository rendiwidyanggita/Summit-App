import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, MapPin, MessageSquareWarning, PackageCheck, ReceiptText, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sections/order-status-badge";
import { DesignParticles } from "@/components/sections/design-particles";
import { OrderTimeline } from "@/components/sections/order-timeline";
import { ReviewFormMock } from "@/components/sections/review-form-mock";
import { SupportFormMock } from "@/components/sections/support-form-mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type OrderMock } from "@/lib/order-mock";
import { formatRupiah } from "@/lib/utils";

export function OrderDetailView({ order }: { order: OrderMock }) {
  return (
    <div className="container-page py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/akun/pesanan">
          <ArrowLeft /> Kembali ke pesanan
        </Link>
      </Button>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="summit-dark relative overflow-hidden p-5 sm:p-7">
          <DesignParticles />
          <div className="relative">
          <Badge variant="accent">Detail Order</Badge>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-5xl">{order.orderNumber}</h1>
              <p className="mt-2 text-sm text-primary-foreground/78">Dibuat {order.createdAt}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} className="bg-white/15 text-primary-foreground" />
              <PaymentStatusBadge status={order.paymentStatus} className="bg-white/15 text-primary-foreground" />
            </div>
          </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PackageCheck className="size-5 text-primary" /> Item pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-[1.25rem] border p-3 sm:flex-row">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium line-clamp-1">{item.product.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Varian {item.variant.name} - {item.quantity} x {formatRupiah(item.product.price)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-secondary px-3 py-1">{item.product.brand}</span>
                      <span className="rounded-full bg-secondary px-3 py-1">{Math.round((item.product.weightGram * item.quantity) / 100) / 10} kg</span>
                    </div>
                  </div>
                  <div className="hidden text-right font-semibold sm:block">{formatRupiah(item.product.price * item.quantity)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="size-5 text-primary" /> Alamat dan pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-secondary p-4">
                <div className="font-medium">{order.address.recipient}</div>
                <div className="mt-1 text-sm text-muted-foreground">{order.address.phone}</div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {order.address.fullAddress}, {order.address.city}, {order.address.province} {order.address.postalCode}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="size-4 text-primary" />
                  {order.shipping.courier} {order.shipping.service}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Estimasi {order.shipping.estimate}</div>
                {order.trackingNumber ? <div className="mt-3 rounded-md bg-background px-3 py-2 text-sm font-medium">Resi {order.trackingNumber}</div> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="size-5 text-primary" /> Timeline order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline items={order.timeline} />
            </CardContent>
          </Card>

          <ReviewFormMock order={order} />
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ReceiptText className="size-5 text-primary" /> Ringkasan biaya
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Ongkir</span>
                <span className="font-medium">{formatRupiah(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Voucher</span>
                <span className="font-medium">{order.discount ? `-${formatRupiah(order.discount)}` : "-"}</span>
              </div>
              <Separator />
              <div className="flex items-end justify-between gap-3">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-semibold">{formatRupiah(order.total)}</span>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2 font-medium">
                  <CreditCard className="size-4 text-primary" />
                  {order.paymentMethod.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{order.paymentMethod.description}</div>
              </div>
              {order.paymentStatus === "PENDING" ? (
                <Button asChild>
                  <Link href={`/pembayaran/${order.id}`}>Lanjut bayar</Link>
                </Button>
              ) : (
                <Button disabled>Konfirmasi diterima</Button>
              )}
              <p className="text-xs leading-5 text-muted-foreground">Action fulfillment, cancel order, invoice, dan status final payment masih placeholder frontend sesuai batas Sprint 5.</p>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RotateCcw className="size-4 text-primary" />
                Return / Komplain
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {order.status === "COMPLETED" || order.status === "SHIPPED" ? (
                <>
                  <SupportFormMock order={order} mode="return" />
                  <Separator />
                  <SupportFormMock order={order} mode="complaint" />
                </>
              ) : (
                <div className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">Return dan komplain aktif setelah order dikirim atau selesai.</div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                  <Link href="/akun/return">
                    <RotateCcw /> Return
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/akun/komplain">
                    <MessageSquareWarning /> Komplain
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
