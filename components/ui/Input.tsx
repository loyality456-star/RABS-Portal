import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className={className}>
        {label && <label className="label" htmlFor={inputId}>{label}</label>}
        <input ref={ref} id={inputId} className="input" {...props} />
        {error && <p className="mt-xs text-body-sm text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";