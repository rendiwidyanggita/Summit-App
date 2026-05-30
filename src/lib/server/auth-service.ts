import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
    email: z.string().trim().email("Email tidak valid").max(180),
    phone: z.string().trim().min(8).max(24).optional().or(z.literal("")),
    password: z.string().min(8, "Password minimal 8 karakter").max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export async function registerCustomer(input: z.infer<typeof registerSchema>) {
  const email = input.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      ok: false as const,
      code: "EMAIL_ALREADY_REGISTERED",
      message: "Email sudah terdaftar.",
    };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      phone: input.phone || null,
      passwordHash,
      provider: "credentials",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  return {
    ok: true as const,
    user,
  };
}

export async function getAdminClaims(userId: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!admin || admin.status !== "ACTIVE") {
    return {
      isAdmin: false,
      roles: [],
      permissions: [],
    };
  }

  return {
    isAdmin: true,
    roles: [admin.role.code],
    permissions: admin.role.permissions.map((item) => item.permission.code),
  };
}
