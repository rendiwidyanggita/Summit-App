import { Loader2 } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";

export default function CustomerLoading() {
  return (
    <div className="container-page grid min-h-[58vh] place-items-center py-10">
      <RouteStatePanel
        icon={Loader2}
        eyebrow="Customer UI"
        title="Merapikan jalur belanja"
        description="Halaman customer sedang dimuat dengan loading state yang konsisten untuk katalog, checkout, support, dan artikel."
        className="[&_svg]:animate-spin"
      />
    </div>
  );
}
