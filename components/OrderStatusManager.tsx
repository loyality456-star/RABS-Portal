"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/Badges";
import { ORDER_STATUSES } from "@/lib/portal";

export function OrderStatusManager({
  id,
  current,
}: {
  id: string;
  current: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(status: string) {
    setBusy(status);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update order.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update order.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-sm">
      <div className="flex items-center gap-sm">
        <span className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
          Current
        </span>
        <StatusChip status={current} />
      </div>
      <div className="flex flex-wrap gap-xs">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            disabled={busy !== null || status === current}
            onClick={() => update(status)}
            className={`chip capitalize ${status === current ? "chip-active" : ""}`}
          >
            {status}
          </button>
        ))}
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}