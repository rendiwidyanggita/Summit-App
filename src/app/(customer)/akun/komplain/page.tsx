import { AccountShell } from "@/components/sections/account-shell";
import { ComplaintCenterPageClient } from "@/components/sections/complaint-center-page-client";

export const metadata = {
  title: "Komplain",
};

export default function ComplaintCenterPage() {
  return (
    <AccountShell title="Komplain" description="Laporkan kendala order, produk, atau pengiriman dan pantau status resolusi.">
      <ComplaintCenterPageClient />
    </AccountShell>
  );
}
