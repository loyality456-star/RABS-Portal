"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function OrderDeleteButton({
  orderId,
  compact = false,
}: {
  orderId: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete order #${orderId} permanently?\n\nAll items will be removed too.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not delete order.");
      if (compact) {
        router.refresh();
      } else {
        router.push("/orders");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete order.");
      setBusy(false);
    }
  }

  return (
    <Button
      size={compact ? "sm" : "md"}
      variant="danger"
      disabled={busy}
      onClick={handleDelete}
    >
      {busy ? "Deleting…" : "Delete order"}
    </Button>
  );
}