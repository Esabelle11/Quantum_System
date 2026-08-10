
// frontend/components/ui/Select.tsx

"use client";

import {
  forwardRef,
  type SelectHTMLAttributes
} from "react";

import {
  cn
} from "@/lib/utils";

export interface SelectOption {
  label: string;

  value: string;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;

  options?: SelectOption[];

  error?: string;
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      className,
      label,
      options = [],
      error,
      id,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          className={cn(
            "h-10 w-full rounded-md border",
            "border-slate-700",
            "bg-slate-950 px-3",
            "text-sm text-slate-100",
            "outline-none",
            "focus:border-blue-500",
            "focus:ring-1",
            "focus:ring-blue-500",
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",

            error &&
              "border-red-500",

            className
          )}
          {...props}
        >
          {children ??
            options.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
        </select>

        {error && (
          <p className="mt-1 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

