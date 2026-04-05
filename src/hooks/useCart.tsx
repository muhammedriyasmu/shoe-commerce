'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CART_STORAGE_KEY } from '@/lib/constants';
import type { CartItem } from '@/types';

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (id: string, size: number, quantity: number) => void;
  removeItem: (id: string, size: number) => void;
  clear: () => void;
  totalItems: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id && p.size === item.size);
      if (!existing) return [...prev, item];

      return prev.map((p) => {
        if (p.id !== item.id || p.size !== item.size) return p;
        const nextQty = Math.min(p.quantity + item.quantity, p.stock);
        return { ...p, quantity: nextQty };
      });
    });
  };

  const updateQty = (id: string, size: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.size !== size) return item;
        return { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) };
      })
    );
  };

  const removeItem = (id: string, size: number) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const clear = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
