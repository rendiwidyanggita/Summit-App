import { RotateCcw } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminReturnPage() {
  return <AdminModulePage title="Return / RMA" description="Review pengajuan return, bukti foto, approval, instruksi pengembalian, dan refund manual." icon={RotateCcw} />;
}
