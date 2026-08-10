
// frontend/components/ui/Dialog.tsx

"use client";

import {
  useEffect,
  useRef,
  type ReactNode
} from "react";

import {
  cn
} from "@/lib/utils";

interface DialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  children: ReactNode;

  className?: string;
}

export default function Dialog({
  open,
  onOpenChange,
  children,
  className
}: DialogProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(
      null
    );

  useEffect(() => {
    const dialog =
      dialogRef.current;

    if (!dialog) {
      return;
    }

    if (
      open &&
      !dialog.open
    ) {
      dialog.showModal();
    }

    if (
      !open &&
      dialog.open
    ) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();

        onOpenChange(false);
      }}
      onClose={() =>
        onOpenChange(false)
      }
      className={cn(
        "m-auto w-full max-w-lg",
        "rounded-lg border",
        "border-slate-700",
        "bg-slate-900",
        "p-0 text-slate-100",
        "shadow-2xl",
        "backdrop:bg-black/60",
        className
      )}
    >
      {children}
    </dialog>
  );
}

interface DialogHeaderProps {
  children: ReactNode;

  className?: string;
}

export function DialogHeader({
  children,
  className
}: DialogHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-slate-800",
        "px-5 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: ReactNode;

  className?: string;
}

export function DialogTitle({
  children,
  className
}: DialogTitleProps) {
  return (
    <h2
      className={cn(
        "text-base font-semibold",
        "text-slate-100",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  children: ReactNode;

  className?: string;
}

export function DialogDescription({
  children,
  className
}: DialogDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-1 text-sm text-slate-400",
        className
      )}
    >
      {children}
    </p>
  );
}

interface DialogContentProps {
  children: ReactNode;

  className?: string;
}

export function DialogContent({
  children,
  className
}: DialogContentProps) {
  return (
    <div
      className={cn(
        "px-5 py-5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface DialogFooterProps {
  children: ReactNode;

  className?: string;
}

export function DialogFooter({
  children,
  className
}: DialogFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end",
        "gap-2",
        "border-t border-slate-800",
        "px-5 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

