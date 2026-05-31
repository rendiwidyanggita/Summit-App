import { z } from "zod";

import { prisma } from "@/lib/db";

export const searchHistoryCreateSchema = z.object({
  query: z.string().trim().min(2).max(120),
});

export async function listSearchHistory(userId: string, limit = 10) {
  const safeLimit = Math.min(50, Math.max(1, Math.trunc(limit)));

  const records = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: safeLimit,
  });

  return records;
}

export async function createSearchHistory(userId: string, query: string) {
  const normalized = query.trim();

  await prisma.searchHistory.deleteMany({
    where: {
      userId,
      query: {
        equals: normalized,
        mode: "insensitive",
      },
    },
  });

  return prisma.searchHistory.create({
    data: {
      userId,
      query: normalized,
    },
  });
}

export async function clearSearchHistory(userId: string) {
  const result = await prisma.searchHistory.deleteMany({
    where: { userId },
  });

  return {
    deleted: result.count,
  };
}
