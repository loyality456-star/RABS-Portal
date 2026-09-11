"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Badges";
import { Textarea } from "@/components/ui/Textarea";
import type { ReviewWithProduct } from "@/lib/schema";

export function ReviewsManager({ reviews }: { reviews: ReviewWithProduct[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  async function submitReply(review: ReviewWithProduct, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const reply = (form.get("reply") as string).trim();
    if (!reply) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save reply.");
      setReplyingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save reply.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(review: ReviewWithProduct) {
    if (!confirm("Delete this review permanently?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}/reply`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not delete review.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete review.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-md">
      {error && <p className="text-body-sm text-error">{error}</p>}

      {reviews.length === 0 ? (
        <Card className="py-3xl text-center">
          <p className="font-display text-headline-sm text-on-surface">
            No reviews yet
          </p>
          <p className="mt-xs text-body-md text-on-surface-variant">
            When customers leave reviews on the storefront, they show up here
            for you to read and reply to.
          </p>
        </Card>
      ) : (
        reviews.map((review) => (
          <Card key={review.id} className="space-y-sm">
            <div className="flex flex-wrap items-center justify-between gap-sm">
              <div>
                <p className="text-title-md text-on-surface">
                  {review.customer_name}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  on{" "}
                  <span className="text-secondary">{review.product_name ?? "a removed product"}</span> ·{" "}
                  {new Date(review.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-sm">
                <Stars rating={review.rating} />
                {review.reply ? (
                  <span className="badge-tag">Replied</span>
                ) : (
                  <span className="badge-tag ring-1 ring-secondary">Awaiting reply</span>
                )}
              </div>
            </div>

            <p className="whitespace-pre-line text-body-md text-on-surface-variant">
              {review.comment}
            </p>

            {review.reply && !review.reply ? null : null}

            {review.reply && replyingId !== review.id && (
              <div className="rounded-[0.5rem] border-l-2 border-secondary bg-surface-container-low px-md py-sm">
                <p className="text-label-md uppercase tracking-[0.06em] text-secondary">
                  Your reply
                </p>
                <p className="mt-xs text-body-md text-on-surface-variant">
                  {review.reply}
                </p>
                <div className="mt-sm flex gap-xs">
                  <Button size="sm" variant="secondary" onClick={() => setReplyingId(review.id)}>
                    Edit reply
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(review)}>
                    Delete review
                  </Button>
                </div>
              </div>
            )}

            {!review.reply && replyingId !== review.id && (
              <div className="flex gap-xs">
                <Button size="sm" onClick={() => setReplyingId(review.id)}>
                  Reply
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(review)}>
                  Delete review
                </Button>
              </div>
            )}

            {replyingId === review.id && (
              <form onSubmit={(e) => submitReply(review, e)} className="space-y-sm">
                <Textarea
                  name="reply"
                  rows={3}
                  defaultValue={review.reply ?? ""}
                  placeholder="Reply to this review… (shown publicly on the storefront)"
                  autoFocus
                />
                <div className="flex gap-xs">
                  <Button type="submit" size="sm" disabled={busy}>
                    Save reply
                  </Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => setReplyingId(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>
        ))
      )}
    </div>
  );
}