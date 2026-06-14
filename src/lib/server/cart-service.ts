import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/server/http";

const cartInclude = {
  items: {
    orderBy: { createdAt: "asc" },
    include: {
      product: {
        include: {
          brand: true,
          category: true,
        },
      },
      variant: true,
    },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;
type CartItemWithProduct = CartWithItems["items"][number];

export const cartItemCreateSchema = z
  .object({
    productId: z.string().trim().optional(),
    productSlug: z.string().trim().optional(),
    variantId: z.string().trim().optional(),
    quantity: z.coerce.number().int().min(1).max(99).default(1),
  })
  .refine((value) => value.productId || value.productSlug, {
    message: "productId atau productSlug wajib diisi.",
  });

export const cartItemUpdateSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99),
});

function effectiveUnitPrice(item: CartItemWithProduct) {
  const basePrice = item.product.discountPrice ?? item.product.price;
  return Number(basePrice) + (item.variant ? Number(item.variant.priceModifier) : 0);
}

function serializeCartItem(item: CartItemWithProduct) {
  const unitPrice = effectiveUnitPrice(item);
  const lineSubtotal = unitPrice * item.quantity;

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice,
    lineSubtotal,
    lineWeightGram: item.product.weightGram * item.quantity,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      photo: item.product.photos[0] ?? null,
      price: Number(item.product.price),
      discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
      weightGram: item.product.weightGram,
      brand: item.product.brand ? { name: item.product.brand.name, slug: item.product.brand.slug } : null,
      category: item.product.category ? { name: item.product.category.name, slug: item.product.category.slug } : null,
    },
    variant: item.variant
      ? {
          id: item.variant.id,
          sku: item.variant.sku,
          size: item.variant.size,
          color: item.variant.color,
          stock: item.variant.stock,
          priceModifier: Number(item.variant.priceModifier),
        }
      : null,
  };
}

export function serializeCart(cart: CartWithItems) {
  const items = cart.items.map(serializeCartItem);
  const subtotal = items.reduce((total, item) => total + item.lineSubtotal, 0);
  const totalWeightGram = items.reduce((total, item) => total + item.lineWeightGram, 0);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary: {
      subtotal,
      totalWeightGram,
      totalQuantity,
      itemCount: items.length,
    },
    updatedAt: cart.updatedAt,
  };
}

export async function getOrCreateCart(userId: string, tx: Prisma.TransactionClient = prisma) {
  return tx.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  });
}

export async function getCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  return serializeCart(cart);
}

async function resolveProduct(input: z.infer<typeof cartItemCreateSchema>, tx: Prisma.TransactionClient) {
  const product = await tx.product.findFirst({
    where: {
      status: "ACTIVE",
      category: { isVisible: true },
      ...(input.productId ? { id: input.productId } : { slug: input.productSlug }),
    },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, "PRODUCT_NOT_FOUND", "Produk tidak ditemukan.");
  }

  const variant = input.variantId ? product.variants.find((item) => item.id === input.variantId) : product.variants[0];

  if (!variant) {
    throw new ApiError(400, "VARIANT_REQUIRED", "Varian produk wajib dipilih.");
  }

  if (variant.stock < input.quantity) {
    throw new ApiError(400, "INSUFFICIENT_STOCK", "Stok produk tidak mencukupi.", {
      availableStock: variant.stock,
    });
  }

  return { product, variant };
}

export async function addCartItem(userId: string, input: z.infer<typeof cartItemCreateSchema>) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(userId, tx);
    const { product, variant } = await resolveProduct(input, tx);
    const existing = cart.items.find((item) => item.productId === product.id && item.variantId === variant.id);
    const nextQuantity = (existing?.quantity ?? 0) + input.quantity;

    if (variant.stock < nextQuantity) {
      throw new ApiError(400, "INSUFFICIENT_STOCK", "Stok produk tidak mencukupi.", {
        availableStock: variant.stock,
      });
    }

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          variantId: variant.id,
          quantity: input.quantity,
        },
      });
    }

    const updated = await tx.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: cartInclude,
    });

    return serializeCart(updated);
  });
}

export async function updateCartItem(userId: string, cartItemId: string, input: z.infer<typeof cartItemUpdateSchema>) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(userId, tx);
    const item = await tx.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      include: {
        variant: true,
      },
    });

    if (!item) {
      throw new ApiError(404, "CART_ITEM_NOT_FOUND", "Item keranjang tidak ditemukan.");
    }

    if (item.variant && item.variant.stock < input.quantity) {
      throw new ApiError(400, "INSUFFICIENT_STOCK", "Stok produk tidak mencukupi.", {
        availableStock: item.variant.stock,
      });
    }

    await tx.cartItem.update({
      where: { id: item.id },
      data: { quantity: input.quantity },
    });

    const updated = await tx.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: cartInclude,
    });

    return serializeCart(updated);
  });
}

export async function removeCartItem(userId: string, cartItemId: string) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(userId, tx);
    const item = await tx.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      select: { id: true },
    });

    if (!item) {
      throw new ApiError(404, "CART_ITEM_NOT_FOUND", "Item keranjang tidak ditemukan.");
    }

    await tx.cartItem.delete({ where: { id: item.id } });

    const updated = await tx.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: cartInclude,
    });

    return serializeCart(updated);
  });
}

export async function clearCart(userId: string) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(userId, tx);
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return serializeCart({ ...cart, items: [] });
  });
}

export async function getCartForCheckout(userId: string, tx: Prisma.TransactionClient = prisma) {
  const cart = await getOrCreateCart(userId, tx);

  if (cart.items.length === 0) {
    throw new ApiError(400, "EMPTY_CART", "Keranjang masih kosong.");
  }

  return cart;
}
