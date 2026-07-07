import { createFileRoute, Link, Outlet, ClientOnly } from "@tanstack/react-router";
import { useOrders, useAuth } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Atelier" },
      { name: "description", content: "Your order history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Outlet />,
});

// Sibling index route below (orders.index.tsx) handles /orders
// This wrapper renders <Outlet /> so /orders/$id can nest.
export function OrdersList() {
  const { orders } = useOrders();
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Sign in required</h1>
        <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Sign in</Link>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">No orders yet</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Browse the shop</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">Your orders</h1>
      <ul className="mt-10 space-y-4">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to="/orders/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 hover:border-accent">
              <div>
                <div className="font-display text-lg">{o.id}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()} • {o.items.length} item{o.items.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{formatPrice(o.subtotal)}</div>
                <div className="mt-1 inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs">{o.status}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { OrdersList as _keep };
