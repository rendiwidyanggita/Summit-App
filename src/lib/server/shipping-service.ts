import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCart } from "@/lib/server/cart-service";
import { ApiError } from "@/lib/server/http";

export const shippingEstimateSchema = z.object({
  addressId: z.string().trim().optional(),
  itemIds: z.array(z.string()).optional(),
});

const baseRates = [
  { id: "jne-reg", courier: "JNE", service: "REG", estimate: "2-3 hari", basePrice: 18000, perKg: 9000 },
  { id: "sicepat-best", courier: "SiCepat", service: "BEST", estimate: "1-2 hari", basePrice: 26000, perKg: 11000 },
  { id: "anteraja-regular", courier: "Anteraja", service: "Regular", estimate: "2-4 hari", basePrice: 16000, perKg: 8000 },
] as const;

function provinceMultiplier(province: string) {
  const normalized = province.toLowerCase();
  if (normalized.includes("papua") || normalized.includes("maluku")) return 2.4;
  if (normalized.includes("sulawesi") || normalized.includes("kalimantan")) return 1.7;
  if (normalized.includes("bali") || normalized.includes("nusa")) return 1.4;
  if (normalized.includes("jakarta") || normalized.includes("jawa") || normalized.includes("yogyakarta")) return 1;
  return 1.25;
}

function codSupported(province: string, subtotal: number) {
  const normalized = province.toLowerCase();
  const remote = normalized.includes("papua") || normalized.includes("maluku");
  return !remote && subtotal <= 1_500_000;
}

export async function estimateShipping(userId: string, input: z.infer<typeof shippingEstimateSchema>) {
  const cart = await getCart(userId);

  if (cart.items.length === 0) {
    throw new ApiError(400, "EMPTY_CART", "Keranjang masih kosong.");
  }

  let cartItems = cart.items;
  if (input.itemIds && input.itemIds.length > 0) {
    cartItems = cartItems.filter((item) => input.itemIds!.includes(item.id));
    if (cartItems.length === 0) {
      throw new ApiError(400, "EMPTY_CART", "Item yang dipilih tidak valid atau sudah dihapus.");
    }
  }

  const totalWeightGram = cartItems.reduce((acc, item) => acc + item.lineWeightGram, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.lineSubtotal, 0);

  const address = input.addressId
    ? await prisma.address.findFirst({ where: { id: input.addressId, userId } })
    : await prisma.address.findFirst({ where: { userId, isPrimary: true } });

  if (!address) {
    throw new ApiError(404, "ADDRESS_NOT_FOUND", "Alamat pengiriman tidak ditemukan.");
  }

  const chargeableKg = Math.max(1, Math.ceil(totalWeightGram / 1000));
  const multiplier = provinceMultiplier(address.province);

  return {
    address: {
      id: address.id,
      label: address.label,
      recipient: address.recipient,
      province: address.province,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      codSupported: codSupported(address.province, subtotal),
    },
    weightGram: totalWeightGram,
    chargeableKg,
    services: baseRates.map((rate) => ({
      id: rate.id,
      courier: rate.courier,
      service: rate.service,
      estimate: rate.estimate,
      price: Math.ceil((rate.basePrice + rate.perKg * chargeableKg) * multiplier / 1000) * 1000,
    })),
  };
}

export function getShippingServiceById(serviceId: string, rates: Awaited<ReturnType<typeof estimateShipping>>) {
  const service = rates.services.find((item) => item.id === serviceId);

  if (!service) {
    throw new ApiError(400, "SHIPPING_SERVICE_INVALID", "Layanan pengiriman tidak valid.");
  }

  return service;
}
