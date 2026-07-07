import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, categories, formatPrice, type Category } from "@/lib/catalog";
import { useWishlist } from "@/lib/store";
import { ClientOnly } from "@tanstack/react-router";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

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
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [max, setMax] = useState<number>(2500);

  const list = useMemo(() => {
    let l = cat === "All" ? products : products.filter((p) => p.category === cat);
    const ql = q.trim().toLowerCase();
    if (ql) l = l.filter((p) => p.name.toLowerCase().includes(ql) || p.blurb.toLowerCase().includes(ql) || p.category.toLowerCase().includes(ql));
    l = l.filter((p) => p.price <= max);
    const sorted = [...l];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [cat, q, sort, max]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl">The shop</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every piece is made in limited runs. When it's gone, it's gone.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-sm rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-md border border-border bg-background px-2 py-1 text-sm">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
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

      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <span>Max price</span>
        <input type="range" min={100} max={2500} step={50} value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-48" />
        <span>{formatPrice(max)}</span>
        <span className="ml-auto text-xs">{list.length} result{list.length === 1 ? "" : "s"}</span>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-16 text-center text-muted-foreground">
          No products match your filters.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="group relative">
              <Link to="/products/$id" params={{ id: p.id }}>
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
              <ClientOnly fallback={null}>
                <WishBtn id={p.id} />
              </ClientOnly>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function WishBtn({ id }: { id: string }) {
  const { has, toggle } = useWishlist();
  const active = has(id);
  return (
    <button
      onClick={() => toggle(id)}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${active ? "bg-accent text-accent-foreground" : "bg-background/80 text-foreground hover:bg-background"}`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
