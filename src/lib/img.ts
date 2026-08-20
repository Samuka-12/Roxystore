/** Requests a higher-resolution render of a Shopify CDN image. */
export function hiRes(url: string | undefined, width = 1600) {
  if (!url) return url;
  if (!url.includes("cdn.shopify.com")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}width=${width}`;
}
