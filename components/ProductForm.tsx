"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Category } from "@/lib/schema";

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image_url: string | null;
    category_id: string | null;
    is_featured: boolean;
    is_active: boolean;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      slug: (form.get("slug") as string) || undefined,
      description: (form.get("description") as string) || "",
      price: Number(form.get("price")),
      image_url: (form.get("image_url") as string) || null,
      category_id: (form.get("category_id") as string) || null,
      is_featured: form.get("is_featured") === "on",
      is_active: form.get("is_active") === "on",
    };

    setError(null);
    setSubmitting(true);
    try {
      const url = initial
        ? `/api/admin/products/${initial.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save product.");
      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-xl">
      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <div className="space-y-md">
          <Card className="space-y-md">
            <h2 className="font-display text-headline-sm text-on-surface">
              Details
            </h2>
            <Input
              label="Product name"
              name="name"
              required
              defaultValue={initial?.name}
              placeholder="E.g. Chamomile Flower Tincture"
            />
            <Input
              label="Slug (URL) — optional, auto-generated"
              name="slug"
              defaultValue={initial?.slug}
              placeholder="auto-generated if left blank"
            />
            <Textarea
              label="Description"
              name="description"
              rows={6}
              defaultValue={initial?.description}
              placeholder="What's in it, what it's for, how to use it…"
            />
          </Card>

          <Card className="space-y-md">
            <h2 className="font-display text-headline-sm text-on-surface">
              Listing
            </h2>
            <div className="grid gap-md sm:grid-cols-2">
              <Input
                label="Price (USD)"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={initial?.price ?? undefined}
              />
              <Select
                label="Category"
                name="category_id"
                defaultValue={initial?.category_id ?? ""}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              label="Image URL"
              name="image_url"
              type="url"
              defaultValue={initial?.image_url ?? ""}
              placeholder="https://… (image is shown on the storefront)"
            />
          </Card>
        </div>

        <div className="space-y-md">
          <Card className="space-y-md">
            <h2 className="font-display text-headline-sm text-on-surface">
              Store placement
            </h2>
            <label className="flex items-center justify-between rounded-[0.5rem] border border-outline-variant px-md py-sm">
              <span className="text-body-md text-on-surface">Featured product</span>
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={initial?.is_featured}
                className="h-5 w-5 accent-primary"
              />
            </label>
            <p className="text-body-sm text-on-surface-variant">
              Featured products are highlighted at the front of the store.
            </p>
            <label className="flex items-center justify-between rounded-[0.5rem] border border-outline-variant px-md py-sm">
              <span className="text-body-md text-on-surface">Active / in stock</span>
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={initial?.is_active ?? true}
                className="h-5 w-5 accent-primary"
              />
            </label>
            <p className="text-body-sm text-on-surface-variant">
              Hide a product from the storefront without deleting it.
            </p>
          </Card>

          <Card className="space-y-sm">
            <h2 className="font-display text-headline-sm text-on-surface">
              Preview
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              The storefront will show this product at its URL and with a "Cash
              on Delivery" badge.
            </p>
          </Card>
        </div>
      </div>

      {error && <p className="text-body-sm text-error">{error}</p>}

      <div className="flex gap-sm">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : initial ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}