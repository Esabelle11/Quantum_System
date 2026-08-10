
// frontend/components/ui/EmptyState.tsx

import {
  type ReactNode
} from "react";

import {
  cn
} from "@/lib/utils";

interface EmptyStateProps {
  title: string;

  description?: string;

  icon?: ReactNode;

  action?: ReactNode;

  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-48",
        "flex-col items-center",
        "justify-center",
        "rounded-lg border",
        "border-dashed",
        "border-slate-800",
        "px-6 py-10",
        "text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-3 text-slate-500">
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold text-slate-200">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-md text-sm text-slate-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

