import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  handle: string;
  title: string;
  image: string;
  price: number;
  size: string;
  qty: number;
};

type CartContext = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: CartItem) => void;
  remove: (handle: string, size: string) => void;
  setQty: (handle: string, size: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Ctx = createContext<CartContext | null>(null);
const KEY = "roxystore-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const found = prev.find((i) => i.handle === item.handle && i.size === item.size);
      if (found) {
        return prev.map((i) => (i === found ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((handle: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.handle === handle && i.size === size)));
  }, []);

  const setQty = useCallback((handle: string, size: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((i) =>
        i.handle === handle && i.size === size ? (qty <= 0 ? [] : [{ ...i, qty }]) : [i],
      ),
    );
  }, []);

  const value = useMemo<CartContext>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return {
      items,
      count,
      subtotal,
      add,
      remove,
      setQty,
      clear: () => setItems([]),
      open,
      setOpen,
    };
  }, [items, open, add, remove, setQty]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
