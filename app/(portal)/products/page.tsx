import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Stars } from "@/components/ui/Badges";
import { ProductRowActions } from "@/components/ProductRowActions";
import { listProductsWithStats } from "@/lib/portal";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProductsWithStats();

  return (
    <div className="space-y-lg">
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">Products</h1>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Add, edit, feature and hide remedies. Featured products show up
            first on the storefront.
          </p>
        </div>
        <Link href="/products/new" className="btn-primary">
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="py-3xl text-center">
          <p className="font-display text-headline-sm text-on-surface">
            No products yet
          </p>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Add your first remedy to the apothecary.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-outline-variant text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  <th className="px-lg py-sm">Product</th>
                  <th className="px-lg py-sm">Category</th>
                  <th className="px-lg py-sm">Price</th>
                  <th className="px-lg py-sm">Rating</th>
                  <th className="px-lg py-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {products.map((product) => (
                  <tr key={product.id} className="align-middle">
                    <td className="px-lg py-sm">
                      <div className="flex items-center gap-sm">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[0.5rem] border border-outline-variant bg-surface-container">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-primary-container/60">
                              🌿
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="block truncate text-title-md text-on-surface hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          <p className="text-body-sm text-on-surface-variant">
                            {product.slug} · {product.review_count}{" "}
                            {product.review_count === 1 ? "review" : "reviews"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-sm text-body-md text-on-surface-variant">
                      {product.category_name ?? "—"}
                    </td>
                    <td className="px-lg py-sm font-display text-title-lg text-primary">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-lg py-sm">
                      {product.average_rating != null ? (
                        <span className="flex items-center gap-xs">
                          <Stars rating={product.average_rating} />
                          <span className="text-body-sm text-on-surface-variant">
                            {product.average_rating}
                          </span>
                        </span>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant">—</span>
                      )}
                    </td>
                    <td className="px-lg py-sm text-right">
                      <ProductRowActions
                        id={product.id}
                        isFeatured={product.is_featured}
                        isActive={product.is_active}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}