import { FileText } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminArticlePage() {
  return <AdminModulePage title="Manajemen Artikel" description="Artikel tips pendakian, review gear, edukasi pemula, slug, metadata, dan Open Graph image." icon={FileText} />;
}
