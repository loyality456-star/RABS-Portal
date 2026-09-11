import { ReviewsManager } from "@/components/ReviewsManager";
import { listReviewsWithProduct } from "@/lib/portal";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await listReviewsWithProduct();

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Reviews</h1>
        <p className="mt-xs text-body-md text-on-surface-variant">
          Read every customer review and reply publicly. Replies appear on the
          storefront beneath the original review.
        </p>
      </div>
      <ReviewsManager reviews={reviews} />
    </div>
  );
}