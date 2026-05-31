import Image from "next/image";
import Link from "next/link";

export function CustomerFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Image src="/logo.png" alt="Summit Gear Logo" width={32} height={32} className="rounded-md bg-white p-1" />
            Summit Gear
          </div>
          <p className="mt-3 text-sm text-primary-foreground/75">
            Peralatan pendakian dan camping untuk pendaki Indonesia, disiapkan untuk katalog, checkout, dan operasional backoffice.
          </p>
        </div>
        <div>
          <div className="font-medium">Belanja</div>
          <div className="mt-3 grid gap-2 text-sm text-primary-foreground/75">
            <Link href="/produk">Produk</Link>
            <Link href="/kategori/tenda">Kategori</Link>
            <Link href="/keranjang">Keranjang</Link>
          </div>
        </div>
        <div>
          <div className="font-medium">Bantuan</div>
          <div className="mt-3 grid gap-2 text-sm text-primary-foreground/75">
            <Link href="/faq">FAQ</Link>
            <Link href="/artikel">Artikel Outdoor</Link>
            <Link href="/akun/pesanan">Pesanan</Link>
            <Link href="/akun/notifikasi">Notifikasi</Link>
            <Link href="/akun/return">Return</Link>
            <Link href="/akun/komplain">Komplain</Link>
          </div>
        </div>
        <div>
          <div className="font-medium">Operasional</div>
          <div className="mt-3 grid gap-2 text-sm text-primary-foreground/75">
            <Link href="/admin">Admin Backoffice</Link>
            <Link href="/admin/produk">Inventory</Link>
            <Link href="/admin/laporan">Laporan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
