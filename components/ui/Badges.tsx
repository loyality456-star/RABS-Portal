import { cx } from "@/lib/format";
import { STATUS_COLORS } from "@/lib/portal";

export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-sm py-[2px] text-label-md capitalize",
        STATUS_COLORS[status] ?? "bg-surface-container text-on-surface-variant"
      )}
    >
      {status}
    </span>
  );
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={cx("inline-flex text-[#8FA668]", className)} aria-label={`${rating} stars`}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}