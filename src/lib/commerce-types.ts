export type CartProductSummary = {
  id: string;
  slug: string;
  name: string;
  photo: string | null;
  price: number;
  discountPrice: number | null;
  weightGram: number;
  brand: {
    name: string;
    slug: string;
  } | null;
  category: {
    name: string;
    slug: string;
  } | null;
};

export type CartVariantSummary = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
  priceModifier: number;
};

export type CartItemResponse = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
  lineWeightGram: number;
  product: CartProductSummary;
  variant: CartVariantSummary | null;
};

export type CartResponse = {
  id: string;
  userId: string;
  items: CartItemResponse[];
  summary: {
    subtotal: number;
    totalWeightGram: number;
    totalQuantity: number;
    itemCount: number;
  };
  updatedAt: string;
};

export type AccountAddressResponse = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  fullAddress: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isPrimary: boolean;
};

export type ShippingServiceResponse = {
  id: string;
  courier: string;
  service: string;
  estimate: string;
  price: number;
};

export type ShippingRatesResponse = {
  address: {
    id: string;
    label: string;
    recipient: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    codSupported: boolean;
  };
  weightGram: number;
  chargeableKg: number;
  services: ShippingServiceResponse[];
};

export type VoucherValidationResponse = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minSpend: number;
  maxDiscount: number | null;
  discount: number;
};

export type CheckoutPaymentMethod = "MIDTRANS_VA" | "MIDTRANS_QRIS" | "MIDTRANS_EWALLET" | "MIDTRANS_CARD" | "COD";

export type CheckoutOrderResponse = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: CheckoutPaymentMethod;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  expiresAt: string | null;
  addressSnapshot: unknown;
  shipment: unknown;
  payment: {
    id: string;
    method: CheckoutPaymentMethod;
    status: string;
    amount: number;
    midtransOrderId: string | null;
    expiredAt: string | null;
  } | null;
  voucher: {
    code: string;
    type: string;
  } | null;
  items: Array<{
    id: string;
    productId: string;
    variantId: string | null;
    productName: string;
    sku: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
};
