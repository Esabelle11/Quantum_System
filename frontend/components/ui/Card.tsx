
// frontend/components/ui/Card.tsx

import {
  type HTMLAttributes,
  type ReactNode
} from "react";

import {
  cn
} from "@/lib/utils";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border",
        "border-slate-800",
        "bg-slate-900",
        "text-slate-100",
        "shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "border-b border-slate-800",
        "px-5 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold",
        "text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-1 text-xs",
        "text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn(
        "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        "border-t border-slate-800",
        "px-5 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

