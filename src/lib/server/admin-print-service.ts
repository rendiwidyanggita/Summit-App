import { getAdminOrder } from "@/lib/server/admin-commerce-service";
import type { CustomerOrderAddress } from "@/lib/commerce-types";

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export async function renderAdminOrderDocument(id: string, type: "invoice" | "packing-list") {
  const order = await getAdminOrder(id);
  const address = order.addressSnapshot as CustomerOrderAddress;
  const title = type === "invoice" ? "Invoice" : "Packing List";
  const itemRows = order.items.map((item) => `
    <tr>
      <td>${escapeHtml(item.product.name)}<br><small>${escapeHtml(item.variant?.sku ?? "-")}</small></td>
      <td>${item.quantity}</td>
      <td>${type === "invoice" ? rupiah(item.unitPrice) : escapeHtml(item.variant?.size ?? item.variant?.color ?? "-")}</td>
      <td>${type === "invoice" ? rupiah(item.subtotal) : "□"}</td>
    </tr>`).join("");

  return `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><title>${title} ${escapeHtml(order.orderNumber)}</title>
<style>body{font:14px Arial,sans-serif;color:#172018;margin:32px}header{display:flex;justify-content:space-between;border-bottom:2px solid #172018;padding-bottom:16px}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{margin-top:24px;text-align:right}.no-print{margin-bottom:20px}@media print{.no-print{display:none}}</style></head>
<body><button class="no-print" onclick="window.print()">Cetak</button><header><div><h1>Summit Gear</h1><strong>${title}</strong></div><div><strong>${escapeHtml(order.orderNumber)}</strong><br>${new Date(order.createdAt).toLocaleString("id-ID")}</div></header>
<section><h3>Penerima</h3><p>${escapeHtml(address.recipient)} · ${escapeHtml(address.phone)}<br>${escapeHtml(address.fullAddress)}<br>${escapeHtml(address.district)}, ${escapeHtml(address.city)}, ${escapeHtml(address.province)} ${escapeHtml(address.postalCode)}</p></section>
<table><thead><tr><th>Produk</th><th>Qty</th><th>${type === "invoice" ? "Harga" : "Varian"}</th><th>${type === "invoice" ? "Subtotal" : "Cek"}</th></tr></thead><tbody>${itemRows}</tbody></table>
${type === "invoice" ? `<div class="total"><p>Subtotal: ${rupiah(order.subtotal)}</p><p>Ongkir: ${rupiah(order.shippingCost)}</p><h2>Total: ${rupiah(order.total)}</h2></div>` : ""}
</body></html>`;
}
