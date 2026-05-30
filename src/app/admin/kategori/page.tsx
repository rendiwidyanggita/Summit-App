import { Tags } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminCategoriesPage() {
  return <AdminModulePage title="Manajemen Kategori" description="CRUD kategori, hierarki, icon, slug, dan metadata SEO kategori." icon={Tags} />;
}
