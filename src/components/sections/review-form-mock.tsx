"use client";

import { useState, type FormEvent } from "react";
import { Camera, Send, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getEligibleReviewItems } from "@/lib/support-trust-data";
import { type OrderMock } from "@/lib/order-mock";

export function ReviewFormMock({ order }: { order: OrderMock }) {
  const eligibleItems = getEligibleReviewItems(order);
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (!eligibleItems.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review produk</CardTitle>
        </CardHeader>
        <CardContent className="rounded-md bg-secondary p-4 text-sm text-muted-foreground">
          {order.status === "COMPLETED" ? "Semua item mock di order ini sudah punya review atau belum eligible." : "Review hanya bisa dibuat setelah order berstatus selesai sesuai PRD."}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tulis Review Mock</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="rounded-lg border border-primary bg-primary/10 p-4 text-sm">
            <div className="font-semibold text-primary">Review mock siap dikirim</div>
            <p className="mt-1 text-muted-foreground">Tidak ada API yang dipanggil. Validasi order selesai, upload foto, dan moderasi tetap pekerjaan backend Sprint 7/fullstack.</p>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="review-item">Item direview</Label>
              <select id="review-item" className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm">
                {eligibleItems.map((item) => (
                  <option key={item.id} value={item.product.slug}>
                    {item.product.name} - {item.variant.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRating(item)}
                    aria-label={`Beri rating ${item} bintang`}
                    aria-pressed={item <= rating}
                    className="rounded-md p-1 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Star className={`size-6 ${item <= rating ? "fill-accent" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review-text">Review</Label>
              <Textarea id="review-text" placeholder="Ceritakan kondisi barang, ukuran, kenyamanan, dan pengalaman dipakai." required />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Camera className="size-3.5" /> Upload foto mock
              </Badge>
              <Badge variant="outline">Moderasi admin</Badge>
            </div>
            <Button type="submit">
              Preview review <Send />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
