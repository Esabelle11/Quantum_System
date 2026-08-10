
// frontend/components/layout/PageContainer.tsx

import {
  type ReactNode
} from "react";

import {
  cn
} from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;

  className?: string;

  /**
   * Optional page title.
   */
  title?: string;

  /**
   * Optional description below the title.
   */
  description?: string;

  /**
   * Optional actions displayed on the right.
   */
  actions?: ReactNode;
}

export default function PageContainer({
  children,
  className,
  title,
  description,
  actions,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1800px]",
        "px-4 py-5",
        "sm:px-6 sm:py-6",
        "lg:px-8",
        className
      )}
    >
      {(title ||
        description ||
        actions) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h1 className="text-xl font-semibold tracking-tight text-slate-100">
                {title}
              </h1>
            )}

            {description && (
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {children}
    </main>
  );
}

