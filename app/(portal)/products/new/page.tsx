import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { query } from "@/lib/db";
import type { Category } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await query<Category>(
    "SELECT * FROM categories ORDER BY name ASC"
  );

  return (
    <div className="space-y-lg">
      <div>
        <Link href="/products" className="eyebrow hover:underline">← Products</Link>
        <h1 className="mt-xs font-display text-headline-lg text-on-surface">
          Add a product
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}