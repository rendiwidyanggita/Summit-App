import { AccountShell } from "@/components/sections/account-shell";
import { ReturnCenterPageClient } from "@/components/sections/return-center-page-client";

export const metadata = {
  title: "Return & RMA",
};

export default function ReturnCenterPage() {
  return (
    <AccountShell title="Return & RMA" description="Ajukan pengembalian barang, pantau status pengembalian, dan lihat kebijakan refund.">
      <ReturnCenterPageClient />
    </AccountShell>
  );
}
