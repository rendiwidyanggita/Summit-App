import { AlertTriangle, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { getAdminSummary } from "@/lib/server/admin-service";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/masuk?callbackUrl=/admin");
  }

  const summary = await getAdminSummary();
  const modules = [
    {
      label: "Produk",
      value: summary.products.toLocaleString("id-ID"),
      note: `${summary.activeProducts} aktif`,
      icon: Package,
    },
    {
      label: "Order aktif",
      value: summary.pendingOrders.toLocaleString("id-ID"),
      note: "Menunggu fulfillment",
      icon: ShoppingBag,
    },
    {
      label: "Revenue",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(summary.revenue),
      note: "Order valid",
      icon: TrendingUp,
    },
    {
      label: "Voucher/banner aktif",
      value: `${summary.activeVouchers}/${summary.activeBanners}`,
      note: "Promo berjalan",
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard Utama"
        description="Ringkasan operasional admin untuk katalog, order, revenue, dan stock alert."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{item.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
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
                {summary.bestSellers.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Aktif</Badge>
                    </TableCell>
                    <TableCell>{product.soldCount} terjual</TableCell>
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
            <CardContent className="text-sm text-muted-foreground">
              {summary.lowStockVariants} varian berada di bawah threshold 10
              unit.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-primary" /> Laporan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Revenue order valid saat ini:{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(summary.revenue)}
              .
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4 text-primary" /> Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Invoice, packing list, input resi manual, dan state transition
              fulfillment sudah aktif.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
