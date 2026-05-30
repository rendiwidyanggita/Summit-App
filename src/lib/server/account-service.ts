import { z } from "zod";

import { prisma } from "@/lib/db";

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(24).optional().or(z.literal("")),
  image: z.string().trim().url().optional().or(z.literal("")),
});

export const addressCreateSchema = z.object({
  label: z.string().trim().min(2).max(60),
  recipient: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(24),
  fullAddress: z.string().trim().min(10).max(1000),
  province: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(120),
  postalCode: z.string().trim().min(4).max(10),
  isPrimary: z.boolean().default(false),
});

export const addressUpdateSchema = addressCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "Minimal satu field harus diubah.",
});

export async function getProfile(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateProfile(userId: string, input: z.infer<typeof profileUpdateSchema>) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      phone: input.phone || null,
      image: input.image || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      emailVerified: true,
      updatedAt: true,
    },
  });
}

export async function listAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(userId: string, input: z.infer<typeof addressCreateSchema>) {
  return prisma.$transaction(async (tx) => {
    if (input.isPrimary) {
      await tx.address.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const existingCount = await tx.address.count({ where: { userId } });

    return tx.address.create({
      data: {
        userId,
        label: input.label,
        recipient: input.recipient,
        phone: input.phone,
        fullAddress: input.fullAddress,
        province: input.province,
        city: input.city,
        district: input.district,
        postalCode: input.postalCode,
        isPrimary: input.isPrimary || existingCount === 0,
      },
    });
  });
}

export async function updateAddress(userId: string, addressId: string, input: z.infer<typeof addressUpdateSchema>) {
  return prisma.$transaction(async (tx) => {
    await tx.address.findFirstOrThrow({
      where: {
        id: addressId,
        userId,
      },
      select: { id: true },
    });

    if (input.isPrimary) {
      await tx.address.updateMany({
        where: { userId, isPrimary: true, id: { not: addressId } },
        data: { isPrimary: false },
      });
    }

    return tx.address.update({
      where: { id: addressId },
      data: input,
    });
  });
}

export async function deleteAddress(userId: string, addressId: string) {
  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirstOrThrow({
      where: {
        id: addressId,
        userId,
      },
    });

    await tx.address.delete({ where: { id: addressId } });

    if (address.isPrimary) {
      const fallback = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (fallback) {
        await tx.address.update({
          where: { id: fallback.id },
          data: { isPrimary: true },
        });
      }
    }

    return { id: addressId };
  });
}
