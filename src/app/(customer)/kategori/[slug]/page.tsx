import { ProductCard } from "@/components/sections/product-card";
import { Badge } from "@/components/ui/badge";
import { featuredProducts } from "@/lib/constants";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replaceAll("-", " ");

  return (
    <div className="container-page py-8">
      <Badge variant="secondary">Kategori</Badge>
      <h1 className="mt-3 text-3xl font-semibold capitalize tracking-normal">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Route kategori SEO-friendly sudah tersedia. Produk di bawah masih data foundation.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
