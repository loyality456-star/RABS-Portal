import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { query, queryOne } from "@/lib/db";
import type { Category, Product } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    queryOne<Product>("SELECT * FROM products WHERE id = ?", [id]),
    query<Category>("SELECT * FROM categories ORDER BY name ASC"),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-lg">
      <div>
        <Link href="/products" className="eyebrow hover:underline">← Products</Link>
        <h1 className="mt-xs font-display text-headline-lg text-on-surface">
          Edit product
        </h1>
      </div>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          category_id: product.category_id,
          is_featured: Boolean(product.is_featured),
          is_active: Boolean(product.is_active),
        }}
      />
    </div>
  );
}