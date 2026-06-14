import { AccountShell } from "@/components/sections/account-shell";
import { WishlistPageClient } from "@/components/sections/wishlist-page-client";

export const metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <AccountShell title="Wishlist" description="Simpan gear favorit dan pantau stok produk yang tersedia.">
      <WishlistPageClient />
    </AccountShell>
  );
}
