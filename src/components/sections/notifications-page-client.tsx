import Link from "next/link";
import { BellRing, Heart, PackageCheck, RotateCcw, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const notifications = [
  { icon: Heart, title: "Wishlist price drop", body: "Summit Ridge Tent 2P turun harga 14%. Notifikasi real akan dikirim dari backend.", tag: "Wishlist" },
  { icon: PackageCheck, title: "Order dikirim", body: "Resi JNE-8821-4475-3091 tersedia untuk order SG-20260529-0008.", tag: "Order" },
  { icon: RotateCcw, title: "Return sedang direview", body: "RMA-20260525-002 menunggu review admin CS dan verifikasi bukti foto.", tag: "Return" },
  { icon: Tag, title: "Voucher aktif", body: "SUMMIT50 bisa dipakai untuk belanja gear dengan minimum transaksi Rp500.000.", tag: "Promo" },
];

export function NotificationsPageClient() {
  return (
    <div className="grid gap-4">
      {notifications.map((item) => (
        <Card key={item.title}>
          <CardContent className="flex gap-4 p-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <item.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{item.title}</h2>
                <Badge variant="secondary">{item.tag}</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex flex-col gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <BellRing className="mt-0.5 size-5 text-accent" />
          <div>
            <div className="font-semibold">Notification service belum aktif</div>
            <p className="mt-1 text-sm text-muted-foreground">Email, in-app notification, dan web push tetap butuh backend service.</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/akun/wishlist">Lihat wishlist</Link>
        </Button>
      </div>
    </div>
  );
}
