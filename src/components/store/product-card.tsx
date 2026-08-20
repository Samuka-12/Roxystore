import { Link } from "@tanstack/react-router";

import type { Product } from "@/lib/catalog.functions";
import { brl } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const off =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : 0;
  const pix = product.price * 0.95;

  return (
    <article className="group">
      <Link
        to="/products/$handle"
        params={{ handle: product.handle }}
        className="block"
        aria-label={product.title}
      >
        <div className="relative aspect-square overflow-hidden bg-card">
          {off > 0 && (
            <span className="absolute left-2 top-2 z-10 bg-sale px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sale-foreground">
              -{off}%
            </span>
          )}
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-xs text-muted-foreground">
              Sem imagem
            </div>
          )}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-snug">{product.title}</h3>
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">
        ★ {product.rating.toFixed(1)} ({product.reviews})
      </p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-display text-base font-bold">{brl(product.price)}</span>
        {off > 0 && product.compare_at_price && (
          <span className="text-xs text-muted-foreground line-through">
            {brl(product.compare_at_price)}
          </span>
        )}
      </div>
      <p className="text-xs text-pix">
        <strong>{brl(pix)}</strong> no pix
      </p>
      <p className="text-xs text-muted-foreground">
        ou 12x de <strong>{brl(product.price / 12)}</strong>
      </p>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.handle} product={p} />
      ))}
    </div>
  );
}
