import { Loader2 } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";

export default function AdminLoading() {
  return (
    <div className="grid min-h-[58vh] place-items-center">
      <RouteStatePanel
        icon={Loader2}
        eyebrow="Admin UI"
        title="Memuat backoffice"
        description="Dashboard admin sedang menyiapkan tabel, filter, dan state operasional frontend."
        className="w-full [&_svg]:animate-spin"
      />
    </div>
  );
}
