
// frontend/components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FlaskConical,
  Gauge,
  LineChart,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    label: "Market",
    href: "/market",
    icon: BarChart3,
  },
  {
    label: "Research",
    href: "/research",
    icon: FlaskConical,
  },
  {
    label: "Backtest",
    href: "/backtest",
    icon: LineChart,
  },
  {
    label: "Strategy",
    href: "/strategy",
    icon: Target,
  },
  {
    label: "Trading",
    href: "/trading",
    icon: TrendingUp,
  },
];

const secondaryNavigation: NavigationItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40",
          "hidden w-64 border-r",
          "border-slate-800 bg-slate-950",
          "lg:flex lg:flex-col"
        )}
      >
        <SidebarContent
          pathname={pathname}
          isActive={isActive}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "flex w-72 flex-col",
          "border-r border-slate-800",
          "bg-slate-950",
          "transition-transform duration-200",
          "lg:hidden",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-end px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarContent
          pathname={pathname}
          isActive={isActive}
          onNavigate={onClose}
        />
      </aside>
    </>
  );
}

interface SidebarContentProps {
  pathname: string;

  isActive: (href: string) => boolean;

  onNavigate?: () => void;
}

function SidebarContent({
  isActive,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo / system identity */}
      <div className="flex h-16 items-center border-b border-slate-800 px-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>

          <div>
            <div className="text-sm font-semibold text-white">
              Quant System
            </div>

            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              BTCUSDT
            </div>
          </div>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          System
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md",
                "px-3 py-2.5",
                "text-sm transition-colors",

                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active
                    ? "text-blue-400"
                    : "text-slate-500"
                )}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="my-5 border-t border-slate-900" />

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Configuration
        </p>

        {secondaryNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md",
                "px-3 py-2.5",
                "text-sm transition-colors",

                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* System status */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-medium text-slate-300">
              System Online
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Environment
            </span>

            <span className="flex items-center gap-1.5 text-amber-400">
              <Shield className="h-3 w-3" />
              Paper
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

