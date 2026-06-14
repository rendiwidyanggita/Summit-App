import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetailView } from "@/components/sections/article-detail-view";
import { getPublicArticle } from "@/lib/server/trust-support-service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicArticle(slug).catch(() => null);
  const article = result?.article;

  if (!article) {
    return {
      title: "Artikel",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/artikel/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
      type: "article",
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicArticle(slug).catch(() => null);
  const article = result?.article;

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} relatedArticles={result?.related ?? []} />;
}
