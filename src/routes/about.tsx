import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our story — Atelier" },
      { name: "description", content: "How Atelier began, and the small workshops we work with around the world." },
      { property: "og:title", content: "Our story — Atelier" },
      { property: "og:description", content: "How Atelier began, and the small workshops we work with around the world." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-5xl">A small studio, a slow catalog.</h1>
      <div className="mt-10 space-y-6 text-lg text-muted-foreground">
        <p>
          Atelier began in a converted stable outside Copenhagen in 2014, with a single lounge chair
          and the stubborn conviction that a home shouldn't be furnished all at once.
        </p>
        <p>
          Today we work with forty-odd independent makers across Europe and Japan — potters,
          weavers, joiners, metal-spinners — releasing a tightly-edited catalog four times a year.
        </p>
        <p>
          Every piece is made to order or in small runs. When something sells out, we don't rush to
          restock it: we let the maker decide when — and whether — to make more.
        </p>
      </div>
      <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
        <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Founded</dt><dd className="mt-2 font-display text-3xl">2014</dd></div>
        <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Makers</dt><dd className="mt-2 font-display text-3xl">40+</dd></div>
        <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Countries</dt><dd className="mt-2 font-display text-3xl">12</dd></div>
        <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Warranty</dt><dd className="mt-2 font-display text-3xl">10 yr</dd></div>
      </dl>
    </section>
  );
}
