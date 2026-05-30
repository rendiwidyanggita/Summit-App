import { UserRound } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function ProfilePage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Profil Akun</h1>
      <EmptyState icon={UserRound} title="Profil masuk Sprint 2" description="Route akun sudah tersedia untuk proteksi session Auth.js. Form edit nama, nomor HP, dan foto profil akan dibuat setelah auth flow aktif." />
    </div>
  );
}
