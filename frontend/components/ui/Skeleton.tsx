
// frontend/components/ui/Skeleton.tsx

import {
  type HTMLAttributes
} from "react";

import {
  cn
} from "@/lib/utils";

interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md",
        "bg-slate-800",
        className
      )}
      {...props}
    />
  );
}

