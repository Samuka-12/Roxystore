import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldCheck, Truck } from "lucide-react";

import { brl, useCart } from "@/lib/cart";
import { getProduct } from "@/lib/catalog.functions";
import { hiRes } from "@/lib/img";

const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: () => getProduct({ data: { handle } }),
  });

export const Route = createFileRoute("/products/$handle")({
  head: ({ params }) => {
    const name = params.handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const title = `${name} | RoxyStore - Brasil`;
    const description = `${name} disponível na RoxyStore - Brasil. Frete grátis acima de R$ 199, 5% off no pix e até 12x sem juros.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.handle));
    if (!product) throw notFound();
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const product = useSuspenseQuery(productQuery(handle)).data!;
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);

  const off =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden bg-card">
            {product.images[active] && (
              <img
                src={hiRes(product.images[active], 1600)}
                alt={product.title}
                fetchPriority="high"
                className="size-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.slice(0, 8).map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Imagem ${i + 1}`}
                  className={`size-20 shrink-0 overflow-hidden border ${
                    i === active ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight md:text-4xl">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ★ {product.rating.toFixed(1)} · {product.reviews} avaliações
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold">{brl(product.price)}</span>
            {off > 0 && product.compare_at_price && (
              <>
                <span className="text-muted-foreground line-through">
                  {brl(product.compare_at_price)}
                </span>
                <span className="bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">
                  -{off}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-pix">
            <strong>{brl(product.price * 0.95)}</strong> no pix (5% de desconto)
          </p>
          <p className="text-sm text-muted-foreground">
            ou 12x de <strong>{brl(product.price / 12)}</strong> sem juros
          </p>

          {product.sizes.length > 0 && (
            <div className="mt-7">
              <p className="eyebrow">Tamanho</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-12 border px-3 py-2 text-sm ${
                      s === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              add({
                handle: product.handle,
                title: product.title,
                price: product.price,
                image: product.images[0] ?? "",
                size: size ?? "único",
                qty: 1,
              })
            }
            className="mt-8 w-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground"
          >
            Adicionar ao carrinho
          </button>

          <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="size-4" /> Frete grátis em compras acima de R$ 199
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4" /> Troca garantida em até 30 dias
            </p>
          </div>

          {product.description && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow">Descrição</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
