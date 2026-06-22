"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api-client";
import type { CartResponse } from "@/lib/commerce-types";

type CartContextType = {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItemToCart: (productSlug: string, variantId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<CartResponse>("/api/cart");
      setCart(data);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        setCart(null);
      } else {
        setError(err instanceof Error ? err.message : "Gagal memuat keranjang");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addItemToCart = useCallback(async (productSlug: string, variantId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<CartResponse>("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productSlug, variantId, quantity }),
      });
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan ke keranjang");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItemQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<CartResponse>(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui quantity");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCartItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<CartResponse>(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus item");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<CartResponse>("/api/cart", {
        method: "DELETE",
      });
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengosongkan keranjang");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshCart();
    });
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cart, loading, error, refreshCart, addItemToCart, updateItemQuantity, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
