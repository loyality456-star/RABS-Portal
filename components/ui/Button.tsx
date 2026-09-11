import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/format";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "md" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    const base = "btn";
    const variantClass =
      variant === "primary"
        ? "btn-primary"
        : variant === "secondary"
          ? "btn-secondary"
          : variant === "danger"
            ? "btn bg-error-container text-error-on-container hover:bg-error/20 border border-error/30"
            : "btn-ghost";
    const sizing = size === "sm" ? "!h-9 !px-md !py-0 !text-label-md" : "";
    return (
      <button ref={ref} className={cx(base, variantClass, sizing, className)} {...props} />
    );
  }
);
Button.displayName = "Button";