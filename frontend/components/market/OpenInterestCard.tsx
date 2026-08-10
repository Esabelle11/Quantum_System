
// frontend/components/market/OpenInterestCard.tsx

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import Card from "@/components/ui/Card";

import { cn } from "@/lib/utils";

interface OpenInterestCardProps {
  openInterest: number | null;
  changePct?: number | null;
  previousOpenInterest?: number | null;
  loading?: boolean;
}

function formatNumber(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "--";
  }

  if (value >= 1_000_000_000) {
    return `${(
      value / 1_000_000_000
    ).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    ).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${(
      value / 1_000
    ).toFixed(2)}K`;
  }

  return value.toFixed(2);
}

export default function OpenInterestCard({
  openInterest,
  changePct,
  previousOpenInterest,
  loading = false,
}: OpenInterestCardProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-800" />
          <div className="h-8 w-32 rounded bg-slate-800" />
          <div className="h-4 w-24 rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const change =
    changePct ??
    (openInterest !== null &&
    previousOpenInterest
      ? ((openInterest -
          previousOpenInterest) /
          previousOpenInterest) *
        100
      : null);

  const positive =
    (change ?? 0) >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-violet-400" />

          <span className="text-sm font-medium text-slate-300">
            Open Interest
          </span>
        </div>

        {change !== null && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              positive
                ? "text-emerald-400"
                : "text-red-400"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}

            {positive ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-semibold text-white">
          {formatNumber(
            openInterest
          )}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Total perpetual contract open interest
        </div>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Change
          </span>

          <span
            className={cn(
              "text-sm font-medium",
              positive
                ? "text-emerald-400"
                : "text-red-400"
            )}
          >
            {change === null
              ? "--"
              : `${positive ? "+" : ""}${change.toFixed(
                  2
                )}%`}
          </span>
        </div>
      </div>
    </Card>
  );
}

