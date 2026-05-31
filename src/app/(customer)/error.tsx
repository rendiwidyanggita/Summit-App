"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";
import { Button } from "@/components/ui/button";

export default function CustomerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page grid min-h-[58vh] place-items-center py-10">
      <RouteStatePanel
        icon={AlertTriangle}
        eyebrow="Terjadi kendala"
        title="Halaman customer belum bisa ditampilkan"
        description="Coba muat ulang bagian ini. Kalau masih terjadi, kembali ke katalog agar flow belanja tetap bisa dilanjutkan."
        actions={
          <>
            <Button type="button" onClick={reset}>
              Coba lagi
            </Button>
            <Button variant="outline" asChild>
              <Link href="/produk">Buka katalog</Link>
            </Button>
          </>
        }
      />
    </div>
  );
}
