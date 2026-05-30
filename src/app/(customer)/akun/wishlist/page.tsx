import { Heart } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function WishlistPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Wishlist</h1>
      <EmptyState icon={Heart} title="Wishlist masuk Sprint 7" description="Route favorit tersedia, tetapi persistence wishlist dan notifikasi diskon belum aktif pada foundation sprint." />
    </div>
  );
}
