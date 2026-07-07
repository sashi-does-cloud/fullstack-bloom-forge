import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Atelier" },
      { name: "description", content: "Review the items in your cart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-4xl px-6 py-16 text-muted-foreground">Loading cart…</div>}>
      <CartPage />
    </ClientOnly>
  ),
});

function CartPage() {
  const { lines, subtotal, setQty, remove, count } = useCart();

  if (count === 0) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-muted-foreground">Start with something that will last decades.</p>
        <Link to="/shop" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Browse the shop</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">Your cart</h1>
      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border">
          {lines.map(({ product, qty, total }) => (
            <li key={product.id} className="flex gap-4 py-6">
              <Link to="/products/$id" params={{ id: product.id }} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <Link to="/products/$id" params={{ id: product.id }} className="font-display text-lg hover:text-accent">
                    {product.name}
                  </Link>
                  <div className="text-sm">{formatPrice(total)}</div>
                </div>
                <div className="text-sm text-muted-foreground">{product.category}</div>
                <div className="mt-auto flex items-center gap-4 pt-2">
                  <div className="inline-flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="px-3 py-1 text-sm hover:text-accent" aria-label="Decrease">−</button>
                    <span className="min-w-6 text-center text-sm">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="px-3 py-1 text-sm hover:text-accent" aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-4 font-display text-xl">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button
            onClick={() => { clear(); setCheckedOut(true); }}
            className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Checkout
          </button>
          <Link to="/shop" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
