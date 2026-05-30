import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return fail(422, "VALIDATION_ERROR", "Input tidak valid.", error.flatten());
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return fail(409, "UNIQUE_CONSTRAINT", "Data dengan nilai unik tersebut sudah ada.");
    }

    if (error.code === "P2025") {
      return fail(404, "NOT_FOUND", "Data tidak ditemukan.");
    }
  }

  console.error(error);
  return fail(500, "INTERNAL_SERVER_ERROR", "Terjadi kesalahan pada server.");
}

export async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
