import { catalogProducts, getProductBySlug, type ProductCatalogItem, type ProductVariant } from "@/lib/constants";

export type CartItemMock = {
  id: string;
  product: ProductCatalogItem;
  variant: ProductVariant;
  quantity: number;
};

export type CheckoutAddressMock = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  city: string;
  province: string;
  postalCode: string;
  fullAddress: string;
  isPrimary?: boolean;
  codSupported?: boolean;
};

export type ShippingServiceMock = {
  id: string;
  courier: string;
  service: string;
  estimate: string;
  price: number;
};

export type VoucherMock = {
  code: string;
  label: string;
  type: "fixed" | "free-shipping";
  value: number;
  minSpend: number;
};

export type PaymentMethodMock = {
  id: string;
  label: string;
  description: string;
  group: "Midtrans" | "COD";
};

function product(slug: string) {
  const item = getProductBySlug(slug);

  if (!item) {
    return catalogProducts[0];
  }

  return item;
}

export const initialCartItems: CartItemMock[] = [
  {
    id: "cart-tent",
    product: product("summit-ridge-tent-2p"),
    variant: product("summit-ridge-tent-2p").variants[0],
    quantity: 1,
  },
  {
    id: "cart-stove",
    product: product("campfire-compact-stove"),
    variant: product("campfire-compact-stove").variants[0],
    quantity: 2,
  },
  {
    id: "cart-headlamp",
    product: product("lumentrail-headlamp-300"),
    variant: product("lumentrail-headlamp-300").variants[0],
    quantity: 1,
  },
];

export const checkoutAddresses: CheckoutAddressMock[] = [
  {
    id: "home",
    label: "Rumah",
    recipient: "Summit Customer",
    phone: "0812 3456 7890",
    city: "Sleman",
    province: "DI Yogyakarta",
    postalCode: "55581",
    fullAddress: "Jl. Merapi Raya No. 18, Sleman, Daerah Istimewa Yogyakarta",
    isPrimary: true,
    codSupported: true,
  },
  {
    id: "office",
    label: "Kantor",
    recipient: "Tim Basecamp",
    phone: "0812 8888 7788",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10220",
    fullAddress: "Jl. Sudirman Kav. 7, Jakarta Pusat",
    codSupported: false,
  },
];

export const shippingServices: ShippingServiceMock[] = [
  { id: "jne-reg", courier: "JNE", service: "REG", estimate: "2-3 hari", price: 36000 },
  { id: "sicepat-best", courier: "SiCepat", service: "BEST", estimate: "1-2 hari", price: 48000 },
  { id: "anteraja-regular", courier: "Anteraja", service: "Regular", estimate: "2-4 hari", price: 31000 },
];

export const vouchers: VoucherMock[] = [
  { code: "SUMMIT50", label: "Potongan Rp50.000", type: "fixed", value: 50000, minSpend: 500000 },
  { code: "FREEONGKIR", label: "Gratis ongkir sampai Rp40.000", type: "free-shipping", value: 40000, minSpend: 750000 },
];

export const paymentMethods: PaymentMethodMock[] = [
  { id: "va", label: "Virtual Account", description: "BCA, BNI, BRI, Mandiri via Midtrans.", group: "Midtrans" },
  { id: "qris", label: "QRIS", description: "Bayar dengan aplikasi e-wallet atau mobile banking.", group: "Midtrans" },
  { id: "ewallet", label: "E-Wallet", description: "GoPay, OVO, DANA, ShopeePay sesuai dukungan Midtrans.", group: "Midtrans" },
  { id: "card", label: "Kartu Kredit/Debit", description: "Pembayaran kartu melalui Midtrans.", group: "Midtrans" },
  { id: "cod", label: "COD", description: "Bayar di tempat, maksimal Rp1.500.000 dan wilayah didukung.", group: "COD" },
];

export function getCartSubtotal(items: CartItemMock[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function getCartWeight(items: CartItemMock[]) {
  return items.reduce((total, item) => total + item.product.weightGram * item.quantity, 0);
}

export function getCartQuantity(items: CartItemMock[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getVoucherByCode(code: string) {
  return vouchers.find((voucher) => voucher.code.toLowerCase() === code.trim().toLowerCase());
}

export function getVoucherDiscount(voucher: VoucherMock | null, subtotal: number, shippingCost: number) {
  if (!voucher || subtotal < voucher.minSpend) {
    return 0;
  }

  if (voucher.type === "free-shipping") {
    return Math.min(voucher.value, shippingCost);
  }

  return voucher.value;
}

export function getGrandTotal(items: CartItemMock[], shippingCost: number, voucher: VoucherMock | null) {
  const subtotal = getCartSubtotal(items);
  return subtotal + shippingCost - getVoucherDiscount(voucher, subtotal, shippingCost);
}
