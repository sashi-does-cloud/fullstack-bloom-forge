import { createFileRoute, Link } from "@tanstack/react-router";
import { products, formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const featured = products.slice(0, 3);
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> New — Autumn Collection
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Considered<br />objects for<br /><em className="not-italic text-accent">slow living.</em>
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              A tightly-edited catalog of furniture, lighting and accessories — each piece
              built by hand in small workshops and shipped worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                Browse the shop →
              </Link>
              <Link to="/about" className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Our story
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=75"
                alt="A quiet interior with warm oak furniture and soft light"
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-card p-4 shadow-[var(--shadow-soft)] md:block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Since 2014</div>
              <div className="font-display text-2xl">40+ makers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl">Featured pieces</h2>
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <div className="font-display text-lg">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.category}</div>
                  </div>
                  <div className="text-sm">{formatPrice(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
