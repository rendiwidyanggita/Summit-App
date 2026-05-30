import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  "Checklist pendakian pertama untuk pemula",
  "Cara memilih carrier sesuai durasi perjalanan",
  "Perawatan tenda setelah hujan dan lumpur",
];

export default function ArticlesPage() {
  return (
    <div className="container-page py-8">
      <Badge variant="secondary">Artikel</Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal">Tips Outdoor</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">SEO artikel disiapkan sebagai route. CMS dan CRUD artikel masuk sprint admin/marketing.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {articles.map((title) => (
          <Card key={title}>
            <CardHeader>
              <BookOpen className="size-5 text-primary" />
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/artikel/${title.toLowerCase().replaceAll(" ", "-")}`} className="text-sm font-medium text-primary">
                Baca placeholder
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
