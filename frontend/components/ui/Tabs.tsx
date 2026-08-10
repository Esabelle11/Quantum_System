
// frontend/components/ui/Tabs.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from "react";

import {
  cn
} from "@/lib/utils";

interface TabsContextValue {
  value: string;

  setValue: (
    value: string
  ) => void;
}

const TabsContext =
  createContext<
    TabsContextValue | undefined
  >(undefined);

interface TabsProps {
  defaultValue: string;

  children: ReactNode;

  className?: string;

  value?: string;

  onValueChange?: (
    value: string
  ) => void;
}

export function Tabs({
  defaultValue,
  children,
  className,
  value: controlledValue,
  onValueChange
}: TabsProps) {
  const [
    internalValue,
    setInternalValue
  ] = useState(
    defaultValue
  );

  const value =
    controlledValue ??
    internalValue;

  const setValue = (
    nextValue: string
  ) => {
    setInternalValue(
      nextValue
    );

    onValueChange?.(
      nextValue
    );
  };

  return (
    <TabsContext.Provider
      value={{
        value,
        setValue
      }}
    >
      <div
        className={cn(
          "w-full",
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function useTabs() {
  const context =
    useContext(
      TabsContext
    );

  if (!context) {
    throw new Error(
      "Tabs components must be used inside <Tabs>"
    );
  }

  return context;
}

interface TabsListProps {
  children: ReactNode;

  className?: string;
}

export function TabsList({
  children,
  className
}: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center",
        "rounded-md border",
        "border-slate-800",
        "bg-slate-900 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;

  children: ReactNode;

  className?: string;

  disabled?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false
}: TabsTriggerProps) {
  const {
    value: activeValue,
    setValue
  } = useTabs();

  const active =
    activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={() =>
        setValue(value)
      }
      className={cn(
        "rounded px-3 py-1.5",
        "text-sm font-medium",
        "transition-colors",
        "disabled:pointer-events-none",
        "disabled:opacity-50",

        active
          ? "bg-slate-700 text-white"
          : "text-slate-400 hover:text-slate-200",

        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;

  children: ReactNode;

  className?: string;
}

export function TabsContent({
  value,
  children,
  className
}: TabsContentProps) {
  const {
    value: activeValue
  } = useTabs();

  if (
    activeValue !== value
  ) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-4",
        className
      )}
    >
      {children}
    </div>
  );
}

