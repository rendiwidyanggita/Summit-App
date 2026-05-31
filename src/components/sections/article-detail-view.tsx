import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type ArticleMock } from "@/lib/support-trust-data";

export function ArticleDetailView({
  article,
  relatedArticles,
}: {
  article: ArticleMock;
  relatedArticles: ArticleMock[];
}) {
  return (
    <article>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <Image src={article.image} alt={article.title} fill priority className="object-cover opacity-45" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/20" />
        <div className="container-page relative grid min-h-[420px] content-end py-8">
          <Button variant="secondary" className="mb-5 w-fit" asChild>
            <Link href="/artikel">
              <ArrowLeft /> Artikel
            </Link>
          </Button>
          <div className="max-w-3xl">
            <Badge variant="accent">{article.category}</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">{article.title}</h1>
            <p className="mt-4 text-base leading-7 text-primary-foreground/82">{article.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-primary-foreground/78">
              <span className="inline-flex items-center gap-2">
                <UserRound className="size-4" /> {article.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" /> {article.readingTime}
              </span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">#{tag}</Badge>
            ))}
          </div>
          <div className="mt-6 grid gap-5 text-base leading-8 text-muted-foreground">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-muted-foreground">
            Metadata, Open Graph image, dan slug artikel disiapkan dari data mock lokal. CRUD artikel tetap pekerjaan backend/admin berikutnya.
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="font-semibold">Artikel terkait</h2>
          <div className="mt-3 grid gap-3">
            {relatedArticles.map((item) => (
              <Card key={item.slug}>
                <CardContent className="p-3">
                  <Link href={`/artikel/${item.slug}`} className="font-medium hover:text-primary">{item.title}</Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
