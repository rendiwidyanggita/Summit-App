import { ArticlesPageClient } from "@/components/sections/articles-page-client";

export const metadata = {
  title: "Artikel Outdoor",
  description: "Tips, edukasi, dan panduan gear outdoor dari Summit Gear.",
  alternates: {
    canonical: "/artikel",
  },
  openGraph: {
    title: "Artikel Outdoor",
    description: "Tips, edukasi, dan panduan gear outdoor dari Summit Gear.",
    type: "website",
  },
};

export default function ArticlesPage() {
  return <ArticlesPageClient />;
}
