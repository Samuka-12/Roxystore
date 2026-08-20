CREATE TABLE public.collections (
  handle text PRIMARY KEY,
  title text NOT NULL,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.collections TO anon, authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections are public" ON public.collections FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.products (
  handle text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(10,2),
  images text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  reviews int NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.product_collections (
  product_handle text NOT NULL REFERENCES public.products(handle) ON DELETE CASCADE,
  collection_handle text NOT NULL REFERENCES public.collections(handle) ON DELETE CASCADE,
  PRIMARY KEY (product_handle, collection_handle)
);
CREATE INDEX product_collections_collection_idx ON public.product_collections(collection_handle);
GRANT SELECT ON public.product_collections TO anon, authenticated;
GRANT ALL ON public.product_collections TO service_role;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product collections are public" ON public.product_collections FOR SELECT TO anon, authenticated USING (true);