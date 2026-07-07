import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useWishlist } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { getProduct, formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Atelier" },
      { name: "description", content: "Pieces you're saving for later." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-4xl px-6 py-16 text-muted-foreground">Loading…</div>}>
      <WishlistPage />
    </ClientOnly>
  ),
});

function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const { add } = useCart();
  const items = ids.map(getProduct).filter((p): p is NonNullable<ReturnType<typeof getProduct>> => !!p);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Your wishlist is empty</h1>
        <p className="mt-4 text-muted-foreground">Save pieces to revisit them later.</p>
        <Link to="/shop" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Browse the shop</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">Wishlist</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="group">
            <Link to="/products/$id" params={{ id: p.id }}>
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
            </Link>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="font-display text-lg">{p.name}</div>
              <div className="text-sm">{formatPrice(p.price)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => add(p.id)} className="flex-1 rounded-full bg-primary py-2 text-xs text-primary-foreground">Add to cart</button>
              <button onClick={() => toggle(p.id)} className="rounded-full border border-border px-3 py-2 text-xs">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
