import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./catalog";

type CartItem = { id: string; qty: number };
type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  lines: { product: Product; qty: number; total: number }[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "atelier-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const lines = items
      .map((i) => {
        const product = products.find((p) => p.id === i.id);
        return product ? { product, qty: i.qty, total: product.price * i.qty } : null;
      })
      .filter((x): x is { product: Product; qty: number; total: number } => !!x);
    return {
      items,
      lines,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.total, 0),
      add: (id, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.id === id);
          return found
            ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
            : [...prev, { id, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};
