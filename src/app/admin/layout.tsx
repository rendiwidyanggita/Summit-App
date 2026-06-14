import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/layout/admin-shell";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Backoffice",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/masuk?callbackUrl=/admin");
  return <AdminShell permissions={session.user.permissions}>{children}</AdminShell>;
}
