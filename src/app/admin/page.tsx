import { AlertTriangle, Package, ShoppingBag, TrendingUp } from "lucide-react";

import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { foundationModules } from "@/lib/constants";

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminPageHeader title="Dashboard Utama" description="Ringkasan foundation backoffice untuk sales, order aktif, produk terlaris, revenue bulanan, dan low stock." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {foundationModules.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <item.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{item.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">Placeholder Sprint 1</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="size-4" /> Aktivitas Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sprint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Auth & Account", "Belum aktif", "Sprint 2"],
                  ["Catalog Query", "Belum aktif", "Sprint 3"],
                  ["Cart & Checkout", "Belum aktif", "Sprint 4"],
                  ["Payment & Order", "Belum aktif", "Sprint 5"],
                ].map(([module, status, sprint]) => (
                  <TableRow key={module}>
                    <TableCell className="font-medium">{module}</TableCell>
                    <TableCell><Badge variant="secondary">{status}</Badge></TableCell>
                    <TableCell>{sprint}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-4 text-accent" /> Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Stock alert default &lt; 10 unit sudah tercermin di schema dan akan aktif saat CRUD inventory masuk.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-primary" /> Laporan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Revenue, margin, produk terlaris, dan performa promo disiapkan sebagai modul laporan.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4 text-primary" /> Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Invoice, packing list, dan input resi manual akan masuk setelah order management aktif.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
