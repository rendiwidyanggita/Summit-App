import { AccountShell } from "@/components/sections/account-shell";
import { NotificationsPageClient } from "@/components/sections/notifications-page-client";

export const metadata = {
  title: "Notifikasi",
};

export default function NotificationsPage() {
  return (
    <AccountShell title="Notifikasi" description="Preview notifikasi transaksi, wishlist price drop, return, dan promo tanpa service backend.">
      <NotificationsPageClient />
    </AccountShell>
  );
}
