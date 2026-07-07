import { createFileRoute, Link, useNavigate, ClientOnly } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAddresses, useAuth, useOrders, type Address } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Atelier" },
      { name: "description", content: "Complete your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-4xl px-6 py-16 text-muted-foreground">Loading…</div>}>
      <Checkout />
    </ClientOnly>
  ),
});

function Checkout() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { lines, subtotal, clear, count } = useCart();
  const { addresses, add: addAddress } = useAddresses();
  const { place } = useOrders();

  const [selectedAddr, setSelectedAddr] = useState<string | null>(addresses[0]?.id ?? null);
  const [showNewAddr, setShowNewAddr] = useState(addresses.length === 0);
  const [form, setForm] = useState({ label: "Home", name: user?.name ?? "", line1: "", city: "", zip: "", country: "" });
  const [method, setMethod] = useState<"card" | "upi">("card");
  const [card, setCard] = useState({ number: "", name: user?.name ?? "", exp: "", cvc: "" });
  const [upi, setUpi] = useState("");
  const [placing, setPlacing] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Sign in to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">You'll need an account to track orders.</p>
        <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Sign in</Link>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Browse the shop</Link>
      </section>
    );
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    let address: Address | undefined = addresses.find((a) => a.id === selectedAddr);
    if (showNewAddr || !address) {
      if (!form.line1 || !form.city || !form.zip || !form.country || !form.name) {
        setPlacing(false);
        return;
      }
      address = addAddress(form);
    }
    const last4 = method === "card"
      ? card.number.replace(/\s/g, "").slice(-4).padStart(4, "•")
      : (upi.split("@")[0] || "upi").slice(-4);
    const order = place({
      items: lines.map((l) => ({ id: l.product.id, name: l.product.name, qty: l.qty, price: l.product.price, image: l.product.image })),
      subtotal,
      address: address!,
      payment: { method, last4 },
    });
    clear();
    nav({ to: "/orders/$id", params: { id: order.id } });
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-2xl">Shipping address</h2>
            {addresses.length > 0 && (
              <div className="mt-4 space-y-2">
                {addresses.map((a) => (
                  <label key={a.id} className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${selectedAddr === a.id && !showNewAddr ? "border-primary" : "border-border"}`}>
                    <input type="radio" checked={selectedAddr === a.id && !showNewAddr} onChange={() => { setSelectedAddr(a.id); setShowNewAddr(false); }} />
                    <div className="text-sm">
                      <div className="font-medium">{a.label} — {a.name}</div>
                      <div className="text-muted-foreground">{a.line1}, {a.city} {a.zip}, {a.country}</div>
                    </div>
                  </label>
                ))}
                <button type="button" onClick={() => setShowNewAddr((s) => !s)} className="text-sm text-accent hover:underline">
                  {showNewAddr ? "Use saved address" : "+ Add new address"}
                </button>
              </div>
            )}
            {(showNewAddr || addresses.length === 0) && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Label" v={form.label} on={(v) => setForm({ ...form, label: v })} />
                <Input label="Full name" v={form.name} on={(v) => setForm({ ...form, name: v })} />
                <Input label="Street" v={form.line1} on={(v) => setForm({ ...form, line1: v })} full />
                <Input label="City" v={form.city} on={(v) => setForm({ ...form, city: v })} />
                <Input label="ZIP" v={form.zip} on={(v) => setForm({ ...form, zip: v })} />
                <Input label="Country" v={form.country} on={(v) => setForm({ ...form, country: v })} full />
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl">Payment</h2>
            <p className="mt-1 text-xs text-muted-foreground">Demo only — no real charge is made.</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setMethod("card")} className={`rounded-full border px-4 py-1.5 text-sm ${method === "card" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>Card (Stripe)</button>
              <button type="button" onClick={() => setMethod("upi")} className={`rounded-full border px-4 py-1.5 text-sm ${method === "upi" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>UPI (Razorpay)</button>
            </div>
            {method === "card" ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Card number" v={card.number} on={(v) => setCard({ ...card, number: v })} full placeholder="4242 4242 4242 4242" />
                <Input label="Name on card" v={card.name} on={(v) => setCard({ ...card, name: v })} full />
                <Input label="Expiry" v={card.exp} on={(v) => setCard({ ...card, exp: v })} placeholder="MM/YY" />
                <Input label="CVC" v={card.cvc} on={(v) => setCard({ ...card, cvc: v })} placeholder="123" />
              </div>
            ) : (
              <div className="mt-4">
                <Input label="UPI ID" v={upi} on={setUpi} full placeholder="name@upi" />
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="text-sm font-medium">Order summary</div>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.product.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{l.product.name} × {l.qty}</span>
                <span>{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-border pt-4 font-display text-xl">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button disabled={placing} type="submit" className="mt-6 w-full rounded-full bg-primary py-3 text-sm text-primary-foreground disabled:opacity-60">
            {placing ? "Placing…" : "Place order"}
          </button>
        </aside>
      </form>
    </section>
  );
}

function Input({ label, v, on, full, placeholder }: { label: string; v: string; on: (v: string) => void; full?: boolean; placeholder?: string }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
