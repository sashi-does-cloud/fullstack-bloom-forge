import { createFileRoute, Link, notFound, ClientOnly } from "@tanstack/react-router";
import { getProduct, formatPrice, products } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useAuth, useReviews, useWishlist } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Atelier` },
          { name: "description", content: loaderData.product.blurb },
          { property: "og:title", content: `${loaderData.product.name} — Atelier` },
          { property: "og:description", content: loaderData.product.blurb },
          { property: "og:image", content: loaderData.product.image },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Product not found — Atelier" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/shop" className="mt-6 inline-block text-accent hover:underline">← Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">← Back to shop</Link>
      <div className="mt-6 grid gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{product.category}</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-4 text-2xl">{formatPrice(product.price)}</div>
          <p className="mt-6 max-w-md text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => { add(product.id); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <ClientOnly fallback={null}>
              <WishToggle id={product.id} />
            </ClientOnly>
            <Link to="/cart" className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              View cart
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
            <div><dt className="text-muted-foreground">Ships in</dt><dd className="mt-1">2–3 weeks</dd></div>
            <div><dt className="text-muted-foreground">Warranty</dt><dd className="mt-1">10 years</dd></div>
            <div><dt className="text-muted-foreground">Made in</dt><dd className="mt-1">EU / JP</dd></div>
          </dl>
        </div>
      </div>

      <ClientOnly fallback={null}>
        <ReviewsSection productId={product.id} />
      </ClientOnly>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-2xl">You may also like</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                  <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="font-display text-base">{p.name}</span>
                  <span>{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function WishToggle({ id }: { id: string }) {
  const { has, toggle } = useWishlist();
  const active = has(id);
  return (
    <button
      onClick={() => toggle(id)}
      className={`inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium ${active ? "border-accent bg-accent text-accent-foreground" : "border-border hover:bg-accent hover:text-accent-foreground"}`}
    >
      {active ? "♥ In wishlist" : "♡ Save"}
    </button>
  );
}

function Stars({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="inline-flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`text-lg ${n <= rating ? "text-accent" : "text-muted-foreground/40"} ${onChange ? "cursor-pointer" : "cursor-default"}`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { forProduct, add } = useReviews();
  const list = forProduct(productId);
  const avg = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    add({ productId, user: user.name, rating, text: text.trim() });
    setText("");
    setRating(5);
  };

  return (
    <div className="mt-20 border-t border-border pt-12">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl">Reviews</h2>
        {list.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Stars rating={Math.round(avg)} />
            <span>{avg.toFixed(1)} · {list.length} review{list.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {list.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No reviews yet. Be the first.</p>}

      <ul className="mt-6 space-y-4">
        {list.map((r) => (
          <li key={r.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{r.user}</div>
              <Stars rating={r.rating} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            <div className="mt-1 text-xs text-muted-foreground/70">{new Date(r.createdAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-medium">Write a review</div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Your rating</span>
            <Stars rating={rating} onChange={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="mt-3 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Post review</button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link to="/auth" className="text-accent hover:underline">Sign in</Link> to write a review.
        </p>
      )}
    </div>
  );
}
