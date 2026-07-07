import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useOrders, STATUS_FLOW } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order tracking — Atelier" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-3xl px-6 py-16 text-muted-foreground">Loading…</div>}>
      <OrderDetail />
    </ClientOnly>
  ),
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { orders, advance } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Order not found</h1>
        <Link to="/orders" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Back to orders</Link>
      </section>
    );
  }

  const stepIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground">← All orders</Link>
      <h1 className="mt-4 font-display text-4xl">Order {order.id}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString()}</p>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-medium">Tracking</div>
          {order.status !== "Delivered" && (
            <button onClick={() => advance(order.id)} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground">
              Simulate next step →
            </button>
          )}
        </div>
        <ol className="relative flex justify-between">
          {STATUS_FLOW.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center text-center">
              <div className={`h-3 w-3 rounded-full ${i <= stepIndex ? "bg-accent" : "bg-border"}`} />
              <div className={`mt-2 text-[11px] ${i <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}>{s}</div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`absolute top-1.5 h-px ${i < stepIndex ? "bg-accent" : "bg-border"}`} style={{ left: `${(i + 0.5) * (100 / STATUS_FLOW.length)}%`, width: `${100 / STATUS_FLOW.length}%` }} />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-6">
          <div className="text-sm font-medium">Shipping to</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {order.address.name}<br />
            {order.address.line1}<br />
            {order.address.city} {order.address.zip}<br />
            {order.address.country}
          </div>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <div className="text-sm font-medium">Payment</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {order.payment.method === "card" ? "Card" : "UPI"} ending {order.payment.last4}
          </div>
          <div className="mt-4 text-sm font-medium">Total</div>
          <div className="text-lg">{formatPrice(order.subtotal)}</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm font-medium">Items</div>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 p-4">
              <img src={it.image} alt={it.name} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{it.name}</div>
                <div className="text-muted-foreground">Qty {it.qty}</div>
              </div>
              <div className="text-sm">{formatPrice(it.price * it.qty)}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
