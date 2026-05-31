import { z } from "zod";

import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/server/http";

export const voucherValidationSchema = z.object({
  code: z.string().trim().min(2).max(40),
  subtotal: z.coerce.number().nonnegative().optional(),
  shippingCost: z.coerce.number().nonnegative().default(0),
});

export type VoucherValidationInput = z.infer<typeof voucherValidationSchema>;

export function calculateVoucherDiscount(voucher: {
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: unknown;
  maxDiscount: unknown | null;
}, subtotal: number, shippingCost: number) {
  const value = Number(voucher.value);

  if (voucher.type === "FREE_SHIPPING") {
    return Math.min(value, shippingCost);
  }

  if (voucher.type === "PERCENTAGE") {
    const rawDiscount = Math.floor((subtotal * value) / 100);
    return voucher.maxDiscount ? Math.min(rawDiscount, Number(voucher.maxDiscount)) : rawDiscount;
  }

  return Math.min(value, subtotal);
}

export async function validateVoucher(input: VoucherValidationInput) {
  const now = new Date();
  const code = input.code.toUpperCase();
  const subtotal = input.subtotal ?? 0;
  const shippingCost = input.shippingCost ?? 0;

  const voucher = await prisma.voucher.findUnique({
    where: { code },
  });

  if (!voucher || voucher.status !== "ACTIVE" || voucher.startsAt > now || voucher.endsAt < now) {
    throw new ApiError(404, "VOUCHER_NOT_FOUND", "Voucher tidak ditemukan atau tidak aktif.");
  }

  if (subtotal < Number(voucher.minSpend)) {
    throw new ApiError(400, "VOUCHER_MIN_SPEND_NOT_MET", "Minimum belanja voucher belum terpenuhi.", {
      minSpend: Number(voucher.minSpend),
      subtotal,
    });
  }

  if (voucher.quota !== null) {
    const usedCount = await prisma.order.count({
      where: {
        voucherId: voucher.id,
        status: {
          notIn: ["CANCELLED", "EXPIRED"],
        },
      },
    });

    if (usedCount >= voucher.quota) {
      throw new ApiError(400, "VOUCHER_QUOTA_EXHAUSTED", "Kuota voucher sudah habis.");
    }
  }

  const discount = calculateVoucherDiscount(voucher, subtotal, shippingCost);

  return {
    id: voucher.id,
    code: voucher.code,
    type: voucher.type,
    value: Number(voucher.value),
    minSpend: Number(voucher.minSpend),
    maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
    discount,
  };
}
