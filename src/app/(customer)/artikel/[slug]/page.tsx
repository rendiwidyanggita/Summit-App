import { Badge } from "@/components/ui/badge";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <article className="container-page max-w-3xl py-8">
      <Badge variant="secondary">Artikel</Badge>
      <h1 className="mt-3 text-3xl font-semibold capitalize tracking-normal">{slug.replaceAll("-", " ")}</h1>
      <p className="mt-4 text-muted-foreground">Konten artikel masih placeholder untuk foundation route SEO. Detail artikel, metadata dinamis, dan Open Graph image akan ditambahkan saat modul artikel aktif.</p>
    </article>
  );
}
