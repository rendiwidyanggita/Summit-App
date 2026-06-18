"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircle, MessageSquareWarning, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { faqs } from "@/lib/faq-data";

const categories = ["Semua", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

export function FaqPageClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesSearch = keyword ? [faq.question, faq.answer, faq.category].join(" ").toLowerCase().includes(keyword) : true;
      const matchesCategory = category === "Semua" ? true : faq.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  return (
    <div className="container-page py-8">
      <section className="summit-dark relative overflow-hidden rounded-xl border border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1600&q=80"
          alt="Siluet area camp untuk FAQ Summit Gear"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--green-house)]/78" />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <Badge variant="accent">Support Center</Badge>
            <h1 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">FAQ Summit Gear</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Jawaban cepat untuk belanja, pembayaran, pengiriman, return, dan akun customer sesuai alur PRD.
            </p>
          </div>
          <Card className="bg-primary-foreground/95 text-foreground">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Cari bantuan</div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari pertanyaan..." className="bg-background pl-9 text-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <Button key={item} type="button" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} className="shrink-0">
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filteredFaqs.map((faq) => (
          <Card key={faq.id} className="bg-card/92">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant="secondary">{faq.category}</Badge>
                  <h2 className="mt-3 font-semibold">{faq.question}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </div>
                <HelpCircle className="size-5 shrink-0 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[1.25rem] border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold">Masih butuh bantuan?</div>
          <p className="mt-1 text-sm text-muted-foreground">Gunakan pusat komplain atau return dari akun customer untuk bantuan lanjutan.</p>
        </div>
        <Button asChild>
          <Link href="/akun/komplain">
            Pusat komplain <MessageSquareWarning />
          </Link>
        </Button>
      </div>
    </div>
  );
}
