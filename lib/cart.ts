'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from './safeStorage';

export type CartLine = {
  productId: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

function cartKey(line: CartLine): string {
  return `${line.productId}|${line.color}|${line.size}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (line) =>
        set((state) => {
          const existing = state.items.findIndex(
            (item) => cartKey(item) === cartKey(line)
          );
          if (existing >= 0) {
            const items = [...state.items];
            items[existing] = {
              ...items[existing],
              qty: items[existing].qty + line.qty,
            };
            return { items };
          }
          return { items: [...state.items, line] };
        }),
      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),
      updateQty: (index, qty) =>
        set((state) => {
          const items = [...state.items];
          if (qty <= 0) {
            return { items: items.filter((_, i) => i !== index) };
          }
          items[index] = { ...items[index], qty };
          return { items };
        }),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.qty, 0),
    }),
    {
      name: 'pc_cart_v1',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
