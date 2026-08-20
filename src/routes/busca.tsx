import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductGrid } from "@/components/store/product-card";
import { searchProducts } from "@/lib/catalog.functions";

export const Route = createFileRoute("/busca")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Buscar produtos | RoxyStore - Brasil" },
      {
        name: "description",
        content: "Encontre tênis, chuteiras e streetwear no catálogo da RoxyStore - Brasil.",
      },
      { property: "og:title", content: "Buscar produtos | RoxyStore - Brasil" },
      {
        property: "og:description",
        content: "Encontre tênis, chuteiras e streetwear no catálogo da RoxyStore - Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchProducts({ data: { q } }),
    enabled: q.length > 0,
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold uppercase md:text-4xl">
        Resultados para "{q}"
      </h1>
      <div className="mt-10">
        {isLoading && <p className="text-sm text-muted-foreground">Buscando…</p>}
        {!isLoading && data && data.length > 0 && <ProductGrid products={data} />}
        {!isLoading && (!data || data.length === 0) && (
          <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}
