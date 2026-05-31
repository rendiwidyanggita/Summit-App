"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { articles } from "@/lib/support-trust-data";

export function ArticlesPageClient() {
  const [search, setSearch] = useState("");
  const filteredArticles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return articles.filter((article) => (keyword ? [article.title, article.excerpt, article.category, ...article.tags].join(" ").toLowerCase().includes(keyword) : true));
  }, [search]);

  const featured = filteredArticles[0] ?? articles[0];

  return (
    <div className="container-page py-8">
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="rounded-[1.5rem] bg-primary p-5 text-primary-foreground sm:p-7">
          <Badge variant="accent">Artikel & SEO</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Tips Outdoor Summit Gear</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
            Edukasi gear, checklist pendakian, dan maintenance produk untuk mendukung trust customer.
          </p>
          <div className="relative mt-5 max-w-xl">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari artikel..." className="bg-background pl-9 text-foreground" />
          </div>
        </div>
        <Link href={`/artikel/${featured.slug}`} className="group relative min-h-72 overflow-hidden rounded-[1.5rem] bg-primary text-primary-foreground">
          <Image src={featured.image} alt={featured.title} fill className="object-cover opacity-55 transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 48vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <Badge variant="accent">Featured</Badge>
            <h2 className="mt-3 text-2xl font-semibold">{featured.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-primary-foreground/82">{featured.excerpt}</p>
          </div>
        </Link>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card key={article.slug} className="overflow-hidden">
            <Link href={`/artikel/${article.slug}`} className="relative block aspect-[4/3] bg-secondary">
              <Image src={article.image} alt={article.title} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
            </Link>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{article.category}</Badge>
                <Badge variant="outline">{article.readingTime}</Badge>
              </div>
              <Link href={`/artikel/${article.slug}`} className="mt-3 block font-semibold hover:text-primary">
                {article.title}
              </Link>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
              <Button variant="ghost" className="mt-3 px-0" asChild>
                <Link href={`/artikel/${article.slug}`}>
                  Baca artikel <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!filteredArticles.length ? (
        <div className="mt-6 grid place-items-center rounded-lg border bg-card p-10 text-center">
          <BookOpen className="size-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">Artikel tidak ditemukan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Coba kata kunci lain untuk mock artikel Sprint 7.</p>
        </div>
      ) : null}
    </div>
  );
}
