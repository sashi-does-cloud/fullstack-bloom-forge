import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { products, categories, formatPrice, type Category } from "@/lib/catalog";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Atelier" },
      { name: "description", content: "Browse the full Atelier catalog of handmade furniture, lighting, and accessories." },
      { property: "og:title", content: "Shop — Atelier" },
      { property: "og:description", content: "Browse the full Atelier catalog." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [cat, setCat] = useState<Category>("All");
  const list = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl">The shop</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every piece is made in limited runs. When it's gone, it's gone.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "rounded-full border px-4 py-1.5 text-sm transition " +
              (cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground")
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group">
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="font-display text-lg">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.blurb}</div>
              </div>
              <div className="text-sm">{formatPrice(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
