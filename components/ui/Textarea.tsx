import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const areaId = id ?? props.name;
    return (
      <div className={className}>
        {label && <label className="label" htmlFor={areaId}>{label}</label>}
        <textarea ref={ref} id={areaId} className="textarea" {...props} />
        {error && <p className="mt-xs text-body-sm text-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";