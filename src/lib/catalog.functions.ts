import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Product = {
  handle: string;
  title: string;
  description: string;
  brand: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  sizes: string[];
  reviews: number;
  rating: number;
};

export type Collection = { handle: string; title: string; position: number };

function client() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PRODUCT_FIELDS =
  "handle, title, description, brand, price, compare_at_price, images, sizes, reviews, rating";

export const listCollections = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await client()
    .from("collections")
    .select("handle, title, position")
    .order("position");
  return (data ?? []) as Collection[];
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { collection?: string; limit?: number; offset?: number }) => input)
  .handler(async ({ data: input }) => {
    const supabase = client();
    const limit = Math.min(input.limit ?? 24, 60);
    const offset = input.offset ?? 0;

    if (input.collection) {
      const { data: links } = await supabase
        .from("product_collections")
        .select("product_handle")
        .eq("collection_handle", input.collection)
        .range(offset, offset + limit - 1);
      const handles = (links ?? []).map((l) => l.product_handle);
      if (handles.length === 0) return [] as Product[];
      const { data } = await supabase.from("products").select(PRODUCT_FIELDS).in("handle", handles);
      return (data ?? []) as Product[];
    }

    const { data } = await supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .order("reviews", { ascending: false })
      .range(offset, offset + limit - 1);
    return (data ?? []) as Product[];
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { handle: string }) => input)
  .handler(async ({ data: input }) => {
    const { data } = await client()
      .from("products")
      .select(PRODUCT_FIELDS)
      .eq("handle", input.handle)
      .maybeSingle();
    return (data ?? null) as Product | null;
  });

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { q: string }) => input)
  .handler(async ({ data: input }) => {
    const q = input.q.trim();
    if (!q) return [] as Product[];
    const { data } = await client()
      .from("products")
      .select(PRODUCT_FIELDS)
      .ilike("title", `%${q}%`)
      .limit(24);
    return (data ?? []) as Product[];
  });
