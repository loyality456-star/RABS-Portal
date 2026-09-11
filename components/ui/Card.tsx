import type { HTMLAttributes } from "react";
import { cx } from "@/lib/format";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", ...props }: CardProps) {
  return (
    <div className={cx("card", hover && "card-hover", className)} {...props} />
  );
}