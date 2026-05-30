import { Bell } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function NotificationsPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Notifikasi</h1>
      <EmptyState icon={Bell} title="Notifikasi belum aktif" description="Email dan in-app notification akan terhubung saat order, payment, dan return flow tersedia." />
    </div>
  );
}
