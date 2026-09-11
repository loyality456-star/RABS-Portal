import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className={className}>
        {label && <label className="label" htmlFor={selectId}>{label}</label>}
        <select ref={ref} id={selectId} className="select" {...props}>
          {children}
        </select>
        {error && <p className="mt-xs text-body-sm text-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";