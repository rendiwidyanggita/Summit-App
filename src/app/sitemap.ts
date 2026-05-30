import type { MetadataRoute } from "next";

const routes = [
  "",
  "/produk",
  "/kategori/tenda",
  "/keranjang",
  "/checkout",
  "/artikel",
  "/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
