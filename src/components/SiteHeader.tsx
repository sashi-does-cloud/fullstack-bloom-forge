import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { ClientOnly } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl tracking-tight">
          Atelier<span className="text-accent">.</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Home</Link>
          <Link to="/shop" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Shop</Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">About</Link>
        </nav>
        <ClientOnly fallback={<div className="w-16" />}>
          <CartLink />
        </ClientOnly>
      </div>
    </header>
  );
}

function CartLink() {
  const { count } = useCart();
  return (
    <Link to="/cart" className="group inline-flex items-center gap-2 text-sm">
      <span className="hover:text-accent">Cart</span>
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs text-primary-foreground">
        {count}
      </span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-lg">Atelier.</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Considered objects for slow living. Made by hand, shipped worldwide.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-medium">Shop</div>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">All products</Link></li>
            <li><Link to="/about" className="hover:text-foreground">Our story</Link></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Atelier Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
