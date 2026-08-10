
// frontend/components/ui/Input.tsx

"use client";

import {
  forwardRef,
  type InputHTMLAttributes
} from "react";

import {
  cn
} from "@/lib/utils";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;

  helperText?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
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

        <input
          ref={ref}
          id={id}
          className={cn(
            "h-10 w-full rounded-md border",
            "bg-slate-950 px-3",
            "text-sm text-slate-100",
            "placeholder:text-slate-500",
            "outline-none",
            "transition-colors",

            "border-slate-700",
            "focus:border-blue-500",
            "focus:ring-1",
            "focus:ring-blue-500",

            "disabled:cursor-not-allowed",
            "disabled:opacity-50",

            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500",

            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1 text-xs text-red-400">
            {error}
          </p>
        )}

        {!error &&
          helperText && (
            <p className="mt-1 text-xs text-slate-500">
              {helperText}
            </p>
          )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

