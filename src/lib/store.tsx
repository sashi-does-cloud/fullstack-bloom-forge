import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// ---------- Types ----------
export type User = { email: string; name: string };
export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  zip: string;
  country: string;
};
export type OrderStatus = "Placed" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";
export type OrderItem = { id: string; name: string; qty: number; price: number; image: string };
export type Order = {
  id: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  address: Address;
  payment: { method: "card" | "upi"; last4: string };
  status: OrderStatus;
};
export type Review = { id: string; productId: string; user: string; rating: number; text: string; createdAt: number };

// ---------- Storage helpers ----------
const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ---------- Auth ----------
type AuthCtx = {
  user: User | null;
  register: (email: string, name: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};
const AuthContext = createContext<AuthCtx | null>(null);

// ---------- Wishlist ----------
type WishCtx = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; clear: () => void };
const WishContext = createContext<WishCtx | null>(null);

// ---------- Addresses ----------
type AddrCtx = {
  addresses: Address[];
  add: (a: Omit<Address, "id">) => Address;
  remove: (id: string) => void;
};
const AddrContext = createContext<AddrCtx | null>(null);

// ---------- Orders ----------
type OrdersCtx = {
  orders: Order[];
  place: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  advance: (id: string) => void;
};
const OrdersContext = createContext<OrdersCtx | null>(null);

// ---------- Reviews ----------
type ReviewsCtx = {
  reviews: Review[];
  forProduct: (id: string) => Review[];
  add: (r: Omit<Review, "id" | "createdAt">) => void;
};
const ReviewsContext = createContext<ReviewsCtx | null>(null);

const STATUS_FLOW: OrderStatus[] = ["Placed", "Packed", "Shipped", "Out for delivery", "Delivered"];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, { name: string; password: string }>>({});
  const [wish, setWish] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setUsers(read("atl-users", {}));
    setUser(read<User | null>("atl-session", null));
    setWish(read<string[]>("atl-wish", []));
    setAddresses(read<Address[]>("atl-addresses", []));
    setOrders(read<Order[]>("atl-orders", []));
    setReviews(read<Review[]>("atl-reviews", []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) write("atl-users", users); }, [users, hydrated]);
  useEffect(() => { if (hydrated) write("atl-session", user); }, [user, hydrated]);
  useEffect(() => { if (hydrated) write("atl-wish", wish); }, [wish, hydrated]);
  useEffect(() => { if (hydrated) write("atl-addresses", addresses); }, [addresses, hydrated]);
  useEffect(() => { if (hydrated) write("atl-orders", orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) write("atl-reviews", reviews); }, [reviews, hydrated]);

  const auth = useMemo<AuthCtx>(() => ({
    user,
    register: (email, name, password) => {
      const key = email.trim().toLowerCase();
      if (!key || !name || password.length < 6) return { ok: false, error: "Fill all fields (password 6+ chars)." };
      if (users[key]) return { ok: false, error: "An account with this email already exists." };
      setUsers((p) => ({ ...p, [key]: { name, password } }));
      setUser({ email: key, name });
      return { ok: true };
    },
    login: (email, password) => {
      const key = email.trim().toLowerCase();
      const u = users[key];
      if (!u || u.password !== password) return { ok: false, error: "Invalid email or password." };
      setUser({ email: key, name: u.name });
      return { ok: true };
    },
    logout: () => setUser(null),
  }), [user, users]);

  const wishlist = useMemo<WishCtx>(() => ({
    ids: wish,
    has: (id) => wish.includes(id),
    toggle: (id) => setWish((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    clear: () => setWish([]),
  }), [wish]);

  const addr = useMemo<AddrCtx>(() => ({
    addresses,
    add: (a) => {
      const next = { ...a, id: crypto.randomUUID() };
      setAddresses((p) => [...p, next]);
      return next;
    },
    remove: (id) => setAddresses((p) => p.filter((x) => x.id !== id)),
  }), [addresses]);

  const ord = useMemo<OrdersCtx>(() => ({
    orders,
    place: (o) => {
      const order: Order = {
        ...o,
        id: "ATL-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        createdAt: Date.now(),
        status: "Placed",
      };
      setOrders((p) => [order, ...p]);
      return order;
    },
    advance: (id) =>
      setOrders((p) =>
        p.map((o) => {
          if (o.id !== id) return o;
          const i = STATUS_FLOW.indexOf(o.status);
          return { ...o, status: STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)] };
        }),
      ),
  }), [orders]);

  const rev = useMemo<ReviewsCtx>(() => ({
    reviews,
    forProduct: (id) => reviews.filter((r) => r.productId === id),
    add: (r) => setReviews((p) => [{ ...r, id: crypto.randomUUID(), createdAt: Date.now() }, ...p]),
  }), [reviews]);

  return (
    <AuthContext.Provider value={auth}>
      <WishContext.Provider value={wishlist}>
        <AddrContext.Provider value={addr}>
          <OrdersContext.Provider value={ord}>
            <ReviewsContext.Provider value={rev}>{children}</ReviewsContext.Provider>
          </OrdersContext.Provider>
        </AddrContext.Provider>
      </WishContext.Provider>
    </AuthContext.Provider>
  );
}

const need = <T,>(c: T | null, name: string): T => {
  if (!c) throw new Error(`${name} used outside StoreProvider`);
  return c;
};
export const useAuth = () => need(useContext(AuthContext), "useAuth");
export const useWishlist = () => need(useContext(WishContext), "useWishlist");
export const useAddresses = () => need(useContext(AddrContext), "useAddresses");
export const useOrders = () => need(useContext(OrdersContext), "useOrders");
export const useReviews = () => need(useContext(ReviewsContext), "useReviews");

export { STATUS_FLOW };
