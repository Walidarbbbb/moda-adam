'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product, Surtido } from '@/types';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

function surtidoTotal(s: Surtido) {
  return Object.values(s).reduce((a, b) => a + (b ?? 0), 0);
}

interface CartContext {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, surtido: Surtido) => void;
  updateSurtido: (productId: string, surtido: Surtido) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ma:cart');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('ma:cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, surtido: Surtido) => {
    const cantidad_total = surtidoTotal(surtido);
    if (cantidad_total === 0) return;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product.id === product.id);
      if (i >= 0) {
        const copy = [...prev];
        const merged: Surtido = { ...copy[i].surtido };
        SIZES.forEach((s) => {
          merged[s] = (merged[s] ?? 0) + (surtido[s] ?? 0);
        });
        const total = surtidoTotal(merged);
        copy[i] = { ...copy[i], surtido: merged, cantidad_total: total, subtotal: total * product.precio_mayorista };
        return copy;
      }
      return [...prev, { product, surtido, cantidad_total, subtotal: cantidad_total * product.precio_mayorista }];
    });
  }, []);

  const updateSurtido = useCallback((productId: string, surtido: Surtido) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.product.id !== productId) return it;
        const cantidad_total = surtidoTotal(surtido);
        return { ...it, surtido, cantidad_total, subtotal: cantidad_total * it.product.precio_mayorista };
      }),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((a, it) => a + it.cantidad_total, 0), [items]);
  const total = useMemo(() => items.reduce((a, it) => a + it.subtotal, 0), [items]);

  return (
    <Ctx.Provider value={{ items, count, total, addItem, updateSurtido, removeItem, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
