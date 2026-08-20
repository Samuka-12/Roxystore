import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/store/product-card";
import { TrustBar } from "@/components/store/site-footer";
import { listProducts, type Product } from "@/lib/catalog.functions";

const bestSellers = queryOptions({
  queryKey: ["products", "mais-vendidos"],
  queryFn: () => listProducts({ data: { collection: "mais-vendidos", limit: 8 } }),
});

const launches = queryOptions({
  queryKey: ["products", "lancamentos"],
  queryFn: () => listProducts({ data: { collection: "lancamentos", limit: 8 } }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoxyStore - Brasil | Tênis, chuteiras e streetwear" },
      {
        name: "description",
        content:
          "Tênis Nike, Adidas, Asics, New Balance e chuteiras com até 75% off na RoxyStore - Brasil. Frete grátis acima de R$ 199 e 12x no cartão.",
      },
      { property: "og:title", content: "RoxyStore - Brasil | Tênis e streetwear" },
      {
        property: "og:description",
        content: "Lançamentos e mais vendidos com preço de atacado e envio para todo o Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(bestSellers),
      context.queryClient.ensureQueryData(launches),
    ]);
  },
  component: Home,
});

const BRANDS = ["NIKE", "ADIDAS", "NEW BALANCE", "ASICS", "MIZUNO", "PUMA", "JORDAN", "ON RUNNING"];

function Home() {
  const best = useSuspenseQuery(bestSellers).data;
  const news = useSuspenseQuery(launches).data;
  const hero = news[0] ?? best[0];

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-12 md:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="eyebrow text-muted-foreground">Coleção 2026</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.9] md:text-7xl">
              Sale com
              <br />
              produtos
              <br />
              exclusivos
            </h1>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              Os drops mais procurados do Brasil na RoxyStore - Brasil: tênis, chuteiras e conjuntos
              com até 75% de desconto e frete grátis acima de R$ 199.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/collections/$handle"
                params={{ handle: "mais-vendidos" }}
                className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
              >
                Ver mais vendidos <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          {hero?.images[0] && (
            <Link
              to="/products/$handle"
              params={{ handle: hero.handle }}
              className="block overflow-hidden"
            >
              <img
                src="/assets/new-balance-banner-fullhd.png"
                srcSet="/assets/new-balance-banner-fullhd.png 1920w"
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={hero.title}
                fetchPriority="high"
                className="aspect-square w-full object-cover"
              />
            </Link>
          )}
        </div>
      </section>

      <section className="overflow-hidden border-b border-border py-6">
        <div className="marquee-track">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="font-display px-8 text-xl font-bold uppercase opacity-40">
              {brand}
            </span>
          ))}
        </div>
      </section>

      <Section
        title="Mais vendidos"
        subtitle="Os queridinhos da loja"
        handle="mais-vendidos"
        products={best}
      />

      <TrustBar />

      <Section
        title="Lançamentos"
        subtitle="Para usar nessa temporada"
        handle="lancamentos"
        products={news}
      />
    </>
  );
}

function Section({
  title,
  subtitle,
  handle,
  products,
}: {
  title: string;
  subtitle: string;
  handle: string;
  products: Product[];
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-14 lg:px-8">
      <p className="eyebrow text-center text-muted-foreground">{subtitle}</p>
      <h2 className="mt-2 text-center font-display text-3xl font-extrabold uppercase md:text-5xl">
        {title}
      </h2>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/collections/$handle"
          params={{ handle }}
          className="inline-flex items-center gap-2 border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide"
        >
          Ver todos <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
