import Link from "next/link";
import { Compass } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-screen place-items-center py-12">
      <RouteStatePanel
        icon={Compass}
        eyebrow="404"
        title="Jalur ini belum ditemukan"
        description="Alamat yang dibuka belum tersedia di Summit Gear atau sudah berpindah. Kamu bisa kembali ke homepage atau menjelajah katalog produk."
        actions={
          <>
            <Button asChild>
              <Link href="/">Kembali ke Homepage</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/produk">Buka katalog</Link>
            </Button>
          </>
        }
      />
    </main>
  );
}
