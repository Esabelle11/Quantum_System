
// frontend/components/layout/Topbar.tsx

"use client";

import {
  Menu,
  Bell,
  CircleUserRound,
  Shield,
  Wifi,
} from "lucide-react";

import Button from "@/components/ui/Button";

interface TopbarProps {
  onMenuClick?: () => void;
  title?: string;
  description?: string;
}

export default function Topbar({
  onMenuClick,
  title,
  description,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            {title && (
              <h1 className="truncate text-sm font-semibold text-slate-100">
                {title}
              </h1>
            )}

            {description && (
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Market */}
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-slate-500">
              Market
            </span>

            <span className="text-xs font-medium text-slate-200">
              BTCUSDT
            </span>
          </div>

          <div className="hidden h-5 w-px bg-slate-800 md:block" />

          {/* API status */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />

            <span className="text-xs text-slate-400">
              API
            </span>

            <span className="text-xs font-medium text-emerald-400">
              Connected
            </span>
          </div>

          {/* Trading mode */}
          <div className="flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5">
            <Shield className="h-3.5 w-3.5 text-amber-400" />

            <span className="text-xs font-medium text-amber-400">
              Paper
            </span>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* User */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0"
            aria-label="Account"
          >
            <CircleUserRound className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

