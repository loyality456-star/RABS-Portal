import { CategoriesManager } from "@/components/CategoriesManager";
import { query } from "@/lib/db";
import type { Category } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await query<Category>(
    "SELECT * FROM categories ORDER BY name ASC"
  );

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Categories</h1>
        <p className="mt-xs text-body-md text-on-surface-variant">
          Organise the storefront. Categories appear as filter chips on the
          store page.
        </p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}