"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/format";

export function ProductRowActions({
  id,
  isFeatured,
  isActive,
}: {
  id: string;
  isFeatured: boolean;
  isActive: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(payload: Partial<{ is_featured: boolean; is_active: boolean }>) {
    setBusy("update");
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!confirm("Delete this product permanently? Reviews for it are removed too.")) return;
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-xs">
      <div className="flex flex-wrap justify-end gap-xs">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => update({ is_featured: !isFeatured })}
          className={cx(
            "badge-tag",
            isFeatured && "!bg-primary-container !border-primary-container !text-white"
          )}
        >
          {isFeatured ? "★ Featured" : "☆ Feature"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => update({ is_active: !isActive })}
          className={cx(
            "badge-tag",
            !isActive && "opacity-60 line-through"
          )}
        >
          {isActive ? "Active" : "Hidden"}
        </button>
        <Link
          href={`/products/${id}/edit`}
          className="badge-tag hover:bg-surface-container"
        >
          Edit
        </Link>
        <Button size="sm" variant="danger" onClick={remove} disabled={busy !== null}>
          {busy === "delete" ? "…" : "Delete"}
        </Button>
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}