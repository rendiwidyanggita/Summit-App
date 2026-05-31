"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Camera, MessageSquareText, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRatingSummary, getReviewsByProductSlug } from "@/lib/support-trust-data";

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const [ratingFilter, setRatingFilter] = useState(0);
  const summary = getRatingSummary(productSlug);

  const reviews = useMemo(() => {
    const items = getReviewsByProductSlug(productSlug);
    return ratingFilter ? items.filter((review) => review.rating === ratingFilter) : items;
  }, [productSlug, ratingFilter]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 rounded-lg border bg-secondary/60 p-4 md:grid-cols-[220px_1fr]">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold">{summary.count ? summary.average.toFixed(1) : "0.0"}</span>
            <span className="pb-1 text-sm text-muted-foreground">/ 5</span>
          </div>
          <div className="mt-2 flex text-accent">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} className={`size-4 ${item <= Math.round(summary.average) ? "fill-accent" : ""}`} />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{summary.count} review pembeli terverifikasi mock.</p>
        </div>
        <div className="grid gap-2">
          {summary.distribution.map((item) => (
            <button
              key={item.rating}
              type="button"
              onClick={() => setRatingFilter((current) => (current === item.rating ? 0 : item.rating))}
              aria-pressed={ratingFilter === item.rating}
              aria-label={`Filter review ${item.rating} bintang`}
              className={`flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors ${ratingFilter === item.rating ? "bg-background" : "hover:bg-background/70"}`}
            >
              <span className="w-10 font-medium">{item.rating} star</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                <div className="h-full rounded-full bg-accent" style={{ width: `${summary.count ? (item.count / summary.count) * 100 : 0}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={ratingFilter === 0 ? "default" : "outline"} onClick={() => setRatingFilter(0)} aria-pressed={ratingFilter === 0}>
          Semua
        </Button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Button key={rating} type="button" variant={ratingFilter === rating ? "default" : "outline"} onClick={() => setRatingFilter(rating)} aria-pressed={ratingFilter === rating}>
            {rating} star
          </Button>
        ))}
      </div>

      {reviews.length ? (
        <div className="grid gap-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{review.customerName}</h3>
                      <Badge variant="secondary">Verified order</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex text-accent">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <Star key={item} className={`size-3.5 ${item <= review.rating ? "fill-accent" : ""}`} />
                        ))}
                      </span>
                      {review.variant} - {review.createdAt}
                    </div>
                  </div>
                  <Badge variant="outline">{review.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.text}</p>
                {review.photos.length ? (
                  <div className="mt-3 flex gap-2">
                    {review.photos.map((photo) => (
                      <div key={photo} className="relative size-20 overflow-hidden rounded-md bg-secondary">
                        <Image src={photo} alt={`Foto review ${review.customerName}`} fill className="object-cover" sizes="80px" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    <Camera className="size-3.5" />
                    Tidak ada foto
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-lg border bg-card p-8 text-center">
          <MessageSquareText className="size-8 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">Belum ada review di filter ini</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">Review asli akan mengikuti validasi order selesai dan moderasi backend.</p>
        </div>
      )}
    </div>
  );
}
