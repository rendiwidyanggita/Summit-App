import { AccountShell } from "@/components/sections/account-shell";
import { ReturnCenterPageClient } from "@/components/sections/return-center-page-client";

export const metadata = {
  title: "Return & RMA",
};

export default function ReturnCenterPage() {
  return (
    <AccountShell title="Return & RMA" description="Ajukan pengembalian, pantau review admin, dan lihat kebijakan refund manual sesuai PRD.">
      <ReturnCenterPageClient />
    </AccountShell>
  );
}
