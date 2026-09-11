"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Category } from "@/lib/schema";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      description: (form.get("description") as string) || "",
    };
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save category.");
      setEditing(null);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(category: Category) {
    if (
      !confirm(
        `Delete "${category.name}"?\nProducts in this category will become uncategorized.`
      )
    )
      return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not delete category.");
      if (editing?.id === category.id) setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete category.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-lg lg:grid-cols-2">
      <Card className="space-y-md h-fit">
        <h2 className="font-display text-headline-sm text-on-surface">
          {editing ? `Edit "${editing.name}"` : "New category"}
        </h2>
        <form onSubmit={save} className="space-y-md" key={editing?.id ?? "new"}>
          <Input
            label="Name"
            name="name"
            required
            defaultValue={editing?.name}
            placeholder="E.g. Tinctures"
          />
          <Textarea
            label="Description (optional)"
            name="description"
            rows={2}
            defaultValue={editing?.description ?? ""}
          />
          {error && <p className="text-body-sm text-error">{error}</p>}
          <div className="flex gap-sm">
            <Button type="submit" disabled={busy}>
              {editing ? "Save changes" : "Add category"}
            </Button>
            {editing && (
              <Button type="button" variant="secondary" onClick={() => { setEditing(null); setError(null); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <h2 className="border-b border-outline-variant px-lg py-md font-display text-headline-sm text-on-surface">
          Categories ({categories.length})
        </h2>
        {categories.length === 0 ? (
          <p className="px-lg py-md text-body-md text-on-surface-variant">
            No categories yet. Categories become filterable tags on the store.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between gap-sm px-lg py-sm">
                <div className="min-w-0">
                  <p className="text-title-md text-on-surface">{cat.name}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    /{cat.slug}
                    {cat.description && ` · ${cat.description}`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-xs">
                  <Button size="sm" variant="secondary" onClick={() => { setEditing(cat); setError(null); }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(cat)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}