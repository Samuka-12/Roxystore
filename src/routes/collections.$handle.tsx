import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { ProductGrid } from "@/components/store/product-card";
import { NAV } from "@/components/store/site-header";
import { listProducts } from "@/lib/catalog.functions";

const productsQuery = (handle: string) =>
  queryOptions({
    queryKey: ["products", handle],
    queryFn: () => listProducts({ data: { collection: handle, limit: 60 } }),
  });

function titleFor(handle: string) {
  return (
    NAV.find((n) => n.handle === handle)?.title ??
    handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export const Route = createFileRoute("/collections/$handle")({
  head: ({ params }) => {
    const title = `${titleFor(params.handle)} | RoxyStore - Brasil`;
    const description = `Compre ${titleFor(params.handle)} na RoxyStore - Brasil com frete grátis acima de R$ 199, 5% off no pix e parcelamento em 12x.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productsQuery(params.handle)),
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useParams();
  const products = useSuspenseQuery(productsQuery(handle)).data;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold uppercase md:text-5xl">
        {titleFor(handle)}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{products.length} produtos</p>
      <div className="mt-10">
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum produto nesta coleção.</p>
        )}
      </div>
    </div>
  );
}
