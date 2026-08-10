
// frontend/components/ui/Button.tsx

"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes
} from "react";

import {
  cn
} from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;

  size?: ButtonSize;

  fullWidth?: boolean;
}

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center",
          "rounded-md font-medium",
          "transition-colors",
          "focus:outline-none focus:ring-2",
          "focus:ring-offset-2",
          "disabled:pointer-events-none",
          "disabled:opacity-50",

          {
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500":
              variant === "primary",

            "bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500":
              variant === "secondary",

            "border border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 focus:ring-slate-500":
              variant === "outline",

            "bg-transparent text-slate-300 hover:bg-slate-800 focus:ring-slate-500":
              variant === "ghost",

            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "danger"
          },

          {
            "h-8 px-3 text-xs":
              size === "sm",

            "h-10 px-4 text-sm":
              size === "md",

            "h-11 px-5 text-base":
              size === "lg"
          },

          fullWidth && "w-full",

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

