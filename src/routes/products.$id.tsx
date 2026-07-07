import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct, formatPrice, products } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
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

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => { add(product.id); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
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
