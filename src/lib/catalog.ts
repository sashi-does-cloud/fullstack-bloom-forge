export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Chairs" | "Lighting" | "Tables" | "Accessories";
  blurb: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "atelier-lounge",
    name: "Atelier Lounge Chair",
    price: 1290,
    category: "Chairs",
    blurb: "Hand-stitched leather on a solid oak frame.",
    description:
      "Sculpted from steam-bent white oak and wrapped in vegetable-tanned leather that softens with time. Built one at a time in our Copenhagen studio.",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "halo-pendant",
    name: "Halo Pendant",
    price: 420,
    category: "Lighting",
    blurb: "Warm, diffused brass pendant for intimate rooms.",
    description:
      "A hand-spun brass shade with a linen-shielded LED. Casts a low, honeyed light designed for dining tables and reading nooks.",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "monolith-table",
    name: "Monolith Dining Table",
    price: 2450,
    category: "Tables",
    blurb: "A single slab of travertine on blackened steel.",
    description:
      "Quarried in Tivoli, hand-honed, and set on a minimal blackened-steel base. Seats six comfortably.",
    image:
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "linen-throw",
    name: "Heavyweight Linen Throw",
    price: 180,
    category: "Accessories",
    blurb: "Stonewashed European linen, generously oversized.",
    description:
      "Woven in Lithuania from long-staple flax and stonewashed to a lived-in softness. 140 × 200 cm.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "curve-armchair",
    name: "Curve Armchair",
    price: 980,
    category: "Chairs",
    blurb: "Bouclé upholstery over a curved beech shell.",
    description:
      "Low-slung, deeply padded, and covered in ivory bouclé. Every seam is closed by hand.",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "column-lamp",
    name: "Column Floor Lamp",
    price: 640,
    category: "Lighting",
    blurb: "A quiet, architectural presence in any corner.",
    description:
      "Machined aluminium column with a rice-paper diffuser. Dimmable from candlelight to daylight.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "ceramic-vase",
    name: "Hand-thrown Ceramic Vase",
    price: 145,
    category: "Accessories",
    blurb: "Wheel-thrown stoneware with an ash glaze.",
    description:
      "Each vessel is thrown by a single potter in Kyoto and finished with a wood-ash glaze that varies piece to piece.",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "slab-side-table",
    name: "Slab Side Table",
    price: 520,
    category: "Tables",
    blurb: "Walnut and blackened brass, built to last decades.",
    description:
      "A solid walnut top on a slim blackened-brass base. Hand-oiled, never lacquered.",
    image:
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1200&q=70",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const categories = ["All", "Chairs", "Lighting", "Tables", "Accessories"] as const;
export type Category = (typeof categories)[number];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
