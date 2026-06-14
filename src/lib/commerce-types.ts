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
    midtransTransactionId: string | null;
    snapToken: string | null;
    redirectUrl: string | null;
    isDemo: boolean;
    paymentType: string | null;
    fraudStatus: string | null;
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

export type CustomerOrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type CustomerPaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";

export type CustomerOrderAddress = {
  id?: string;
  label?: string;
  recipient?: string;
  phone?: string;
  fullAddress?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
};

export type CustomerOrderResponse = {
  id: string;
  orderNumber: string;
  status: CustomerOrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  expiresAt: string | null;
  stockReleasedAt: string | null;
  addressSnapshot: CustomerOrderAddress;
  createdAt: string;
  updatedAt: string;
  voucher: {
    code: string;
    type: string;
  } | null;
  payment: {
    id: string;
    method: CheckoutPaymentMethod;
    status: CustomerPaymentStatus;
    amount: number;
    midtransOrderId: string | null;
    midtransTransactionId: string | null;
    snapToken: string | null;
    redirectUrl: string | null;
    isDemo: boolean;
    paymentType: string | null;
    fraudStatus: string | null;
    paidAt: string | null;
    expiredAt: string | null;
  } | null;
  shipment: {
    id: string;
    courier: string;
    service: string;
    trackingNo: string | null;
    trackingUrl: string | null;
    status: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  } | null;
  items: Array<{
    id: string;
    productId: string;
    variantId: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: {
      id: string;
      slug: string;
      name: string;
      photo: string | null;
      brand: { name: string; slug: string } | null;
      category: { name: string; slug: string } | null;
    };
    variant: {
      id: string;
      sku: string;
      size: string | null;
      color: string | null;
    } | null;
  }>;
};
