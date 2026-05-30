import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-screen place-items-center py-12">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Route ini belum tersedia atau alamat yang dibuka tidak sesuai dengan struktur Summit Gear.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">Kembali ke Homepage</Link>
        </Button>
      </div>
    </main>
  );
}
