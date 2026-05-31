import type { MetadataRoute } from "next";

import { categoryCatalog } from "@/lib/catalog-mock";
import { listCatalogSitemapEntries } from "@/lib/server/catalog-service";
import { articles } from "@/lib/support-trust-data";

const routes = ["", "/produk", "/keranjang", "/checkout", "/artikel", "/faq"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();
  const catalog = await listCatalogSitemapEntries();

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryRoutes = [
    ...catalog.categories.map((category) => ({
      url: `${baseUrl}/kategori/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...categoryCatalog.map((category) => ({
      url: `${baseUrl}/kategori/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const productRoutes = catalog.products.map((product) => ({
    url: `${baseUrl}/produk/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/artikel/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...productRoutes, ...articleRoutes];

  return Array.from(new Map(allRoutes.map((route) => [route.url, route])).values());
}
