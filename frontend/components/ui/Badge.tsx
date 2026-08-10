
// frontend/components/ui/Badge.tsx

import {
  type HTMLAttributes
} from "react";

import {
  cn
} from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-full px-2.5 py-1",
        "text-xs font-medium",
        "whitespace-nowrap",

        {
          "bg-slate-800 text-slate-300":
            variant === "default",

          "bg-emerald-500/10 text-emerald-400":
            variant === "success",

          "bg-amber-500/10 text-amber-400":
            variant === "warning",

          "bg-red-500/10 text-red-400":
            variant === "danger",

          "bg-blue-500/10 text-blue-400":
            variant === "info",

          "border border-slate-700 text-slate-300":
            variant === "outline"
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

