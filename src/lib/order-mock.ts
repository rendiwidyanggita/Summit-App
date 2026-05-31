import {
  checkoutAddresses,
  getCartSubtotal,
  getGrandTotal,
  getVoucherDiscount,
  initialCartItems,
  paymentMethods,
  shippingServices,
  vouchers,
  type CartItemMock,
  type CheckoutAddressMock,
  type PaymentMethodMock,
  type ShippingServiceMock,
  type VoucherMock,
} from "@/lib/commerce-mock";

export type OrderStatusMock = "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export type PaymentStatusMock = "PENDING" | "PAID" | "FAILED" | "EXPIRED";

export type OrderTimelineItemMock = {
  label: string;
  description: string;
  date: string;
  complete: boolean;
  current?: boolean;
};

export type OrderMock = {
  id: string;
  orderNumber: string;
  status: OrderStatusMock;
  paymentStatus: PaymentStatusMock;
  paymentMethod: PaymentMethodMock;
  createdAt: string;
  expiresAt?: string;
  paidAt?: string;
  trackingNumber?: string;
  address: CheckoutAddressMock;
  shipping: ShippingServiceMock;
  voucher: VoucherMock | null;
  items: CartItemMock[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  timeline: OrderTimelineItemMock[];
};

const primaryAddress = checkoutAddresses[0];
const officeAddress = checkoutAddresses[1];
const regularShipping = shippingServices[0];
const expressShipping = shippingServices[1];
const economyShipping = shippingServices[2];
const vaPayment = paymentMethods.find((method) => method.id === "va") ?? paymentMethods[0];
const qrisPayment = paymentMethods.find((method) => method.id === "qris") ?? paymentMethods[0];
const codPayment = paymentMethods.find((method) => method.id === "cod") ?? paymentMethods[0];
const summitVoucher = vouchers[0];

function cloneItems(items: CartItemMock[]) {
  return items.map((item) => ({ ...item }));
}

function makeOrder({
  id,
  orderNumber,
  status,
  paymentStatus,
  paymentMethod,
  createdAt,
  expiresAt,
  paidAt,
  trackingNumber,
  address,
  shipping,
  voucher,
  items,
  timeline,
}: Omit<OrderMock, "subtotal" | "shippingCost" | "discount" | "total">): OrderMock {
  const subtotal = getCartSubtotal(items);
  const shippingCost = shipping.price;
  const discount = getVoucherDiscount(voucher, subtotal, shippingCost);
  const total = getGrandTotal(items, shippingCost, voucher);

  return {
    id,
    orderNumber,
    status,
    paymentStatus,
    paymentMethod,
    createdAt,
    expiresAt,
    paidAt,
    trackingNumber,
    address,
    shipping,
    voucher,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    timeline,
  };
}

export const mockOrders: OrderMock[] = [
  makeOrder({
    id: "SG-20260531-0001",
    orderNumber: "SG-20260531-0001",
    status: "PENDING_PAYMENT",
    paymentStatus: "PENDING",
    paymentMethod: vaPayment,
    createdAt: "31 Mei 2026, 09:20 WIB",
    expiresAt: "1 Juni 2026, 09:20 WIB",
    address: primaryAddress,
    shipping: regularShipping,
    voucher: summitVoucher,
    items: cloneItems(initialCartItems),
    timeline: [
      { label: "Order dibuat", description: "Stok ditampilkan sebagai reserved notice di UI.", date: "31 Mei 2026, 09:20 WIB", complete: true },
      { label: "Menunggu pembayaran", description: "Customer perlu menyelesaikan pembayaran sebelum batas waktu.", date: "Batas 1 Juni 2026, 09:20 WIB", complete: true, current: true },
      { label: "Diproses gudang", description: "Aktif setelah status pembayaran tervalidasi server.", date: "Menunggu", complete: false },
      { label: "Dikirim", description: "Nomor resi akan tampil setelah admin fulfillment input resi.", date: "Menunggu", complete: false },
    ],
  }),
  makeOrder({
    id: "SG-20260529-0008",
    orderNumber: "SG-20260529-0008",
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: qrisPayment,
    createdAt: "29 Mei 2026, 14:05 WIB",
    paidAt: "29 Mei 2026, 14:09 WIB",
    trackingNumber: "JNE-8821-4475-3091",
    address: primaryAddress,
    shipping: expressShipping,
    voucher: null,
    items: cloneItems(initialCartItems.slice(0, 2)),
    timeline: [
      { label: "Order dibuat", description: "Checkout berhasil dibuat dari mock cart.", date: "29 Mei 2026, 14:05 WIB", complete: true },
      { label: "Pembayaran berhasil", description: "Status final nantinya mengikuti webhook Midtrans.", date: "29 Mei 2026, 14:09 WIB", complete: true },
      { label: "Diproses gudang", description: "Tim operasional menyiapkan packing list dan barang.", date: "30 Mei 2026, 08:40 WIB", complete: true },
      { label: "Dikirim", description: "Resi sudah tersedia untuk dilacak customer.", date: "30 Mei 2026, 16:15 WIB", complete: true, current: true },
    ],
  }),
  makeOrder({
    id: "SG-20260521-0017",
    orderNumber: "SG-20260521-0017",
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: codPayment,
    createdAt: "21 Mei 2026, 10:42 WIB",
    paidAt: "24 Mei 2026, 13:05 WIB",
    trackingNumber: "ANT-4421-9044-1207",
    address: officeAddress,
    shipping: economyShipping,
    voucher: null,
    items: cloneItems(initialCartItems.slice(1, 3)),
    timeline: [
      { label: "Order COD dibuat", description: "Aturan COD ditampilkan di checkout, validasi final tetap server.", date: "21 Mei 2026, 10:42 WIB", complete: true },
      { label: "Diproses gudang", description: "Order masuk antrean fulfillment.", date: "21 Mei 2026, 13:10 WIB", complete: true },
      { label: "Dikirim", description: "Kurir membawa paket ke alamat tujuan.", date: "22 Mei 2026, 09:00 WIB", complete: true },
      { label: "Selesai", description: "Paket diterima dan pembayaran COD dicatat.", date: "24 Mei 2026, 13:05 WIB", complete: true, current: true },
    ],
  }),
];

export function getOrders() {
  return mockOrders;
}

export function getOrderById(orderId: string) {
  return mockOrders.find((order) => order.id === orderId || order.orderNumber === orderId);
}

export function getOrderStatusLabel(status: OrderStatusMock) {
  const labels: Record<OrderStatusMock, string> = {
    PENDING_PAYMENT: "Menunggu Pembayaran",
    PROCESSING: "Diproses",
    SHIPPED: "Dikirim",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };

  return labels[status];
}

export function getPaymentStatusLabel(status: PaymentStatusMock) {
  const labels: Record<PaymentStatusMock, string> = {
    PENDING: "Pending",
    PAID: "Lunas",
    FAILED: "Gagal",
    EXPIRED: "Kedaluwarsa",
  };

  return labels[status];
}
