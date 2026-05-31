import { Loader2 } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";

export default function Loading() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-12">
      <RouteStatePanel icon={Loader2} eyebrow="Loading" title="Menyiapkan Summit Gear" description="Konten sedang dimuat dengan state launch-ready agar transisi halaman tetap terasa rapi." className="[&_svg]:animate-spin" />
    </div>
  );
}
