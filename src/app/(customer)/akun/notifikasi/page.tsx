import { AccountShell } from "@/components/sections/account-shell";
import { NotificationsPageClient } from "@/components/sections/notifications-page-client";

export const metadata = {
  title: "Notifikasi",
};

export default function NotificationsPage() {
  return (
    <AccountShell title="Notifikasi" description="Pantau pembaruan transaksi, return, komplain, dan moderasi review.">
      <NotificationsPageClient />
    </AccountShell>
  );
}
