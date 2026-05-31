"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";
import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[58vh] place-items-center">
      <RouteStatePanel
        icon={AlertTriangle}
        eyebrow="Admin error"
        title="Modul admin belum bisa ditampilkan"
        description="Coba muat ulang halaman. Jika sesi admin habis, kembali ke dashboard atau login ulang mengikuti guard yang sudah ada."
        className="w-full"
        actions={
          <>
            <Button type="button" onClick={reset}>
              Coba lagi
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Dashboard admin</Link>
            </Button>
          </>
        }
      />
    </div>
  );
}
