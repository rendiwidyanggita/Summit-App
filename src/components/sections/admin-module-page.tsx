import { LucideIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { EmptyState } from "@/components/sections/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLaunchNotes, launchReadinessChecks } from "@/lib/launch-readiness-mock";

export function AdminModulePage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div>
      <AdminPageHeader title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <EmptyState
          icon={icon}
          title={`${title} siap sebagai preview frontend`}
          description="Route, layout, navigasi, empty state, dan akses admin sudah rapi untuk launch UI. CRUD, validasi server, RBAC enforcement, audit log, dan integrasi data real tetap masuk pekerjaan backend/fullstack berikutnya."
        />
        <Card className="overflow-hidden">
          <div className="h-1 bg-accent" />
          <CardHeader>
            <CardTitle className="text-base">Launch Readiness</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {launchReadinessChecks.map((check) => (
                <Badge key={check.label} variant={check.status === "mock" ? "secondary" : "default"}>
                  {check.label}
                </Badge>
              ))}
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground">
              {adminLaunchNotes.map((note) => (
                <div key={note.text} className="flex gap-3">
                  <note.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{note.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
