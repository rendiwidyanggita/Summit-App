import { LucideIcon } from "lucide-react";

import { RouteStatePanel } from "@/components/sections/route-state-panel";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <RouteStatePanel icon={Icon} title={title} description={description} />;
}
