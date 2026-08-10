
// frontend/components/market/LiquidationCard.tsx

import {
  ArrowDown,
  ArrowUp,
  Flame,
} from "lucide-react";

import Card from "@/components/ui/Card";

import { cn } from "@/lib/utils";

interface LiquidationCardProps {
  longLiquidation: number | null;
  shortLiquidation: number | null;
  totalLiquidation?: number | null;
  loading?: boolean;
}

function formatUsd(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "--";
  }

  if (value >= 1_000_000_000) {
    return `$${(
      value / 1_000_000_000
    ).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(
      value / 1_000_000
    ).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `$${(
      value / 1_000
    ).toFixed(2)}K`;
  }

  return `$${value.toFixed(2)}`;
}

export default function LiquidationCard({
  longLiquidation,
  shortLiquidation,
  totalLiquidation,
  loading = false,
}: LiquidationCardProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-800" />
          <div className="h-8 w-36 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const total =
    totalLiquidation ??
    (longLiquidation ?? 0) +
      (shortLiquidation ?? 0);

  const long =
    longLiquidation ?? 0;

  const short =
    shortLiquidation ?? 0;

  const longDominant =
    long > short;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />

          <span className="text-sm font-medium text-slate-300">
            Liquidations
          </span>
        </div>

        <span className="text-xs text-slate-500">
          24h
        </span>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-semibold text-white">
          {formatUsd(total)}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Total liquidated positions
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <LiquidationStat
          label="Longs"
          value={long}
          icon={
            <ArrowDown className="h-3.5 w-3.5" />
          }
          className="text-red-400"
        />

        <LiquidationStat
          label="Shorts"
          value={short}
          icon={
            <ArrowUp className="h-3.5 w-3.5" />
          }
          className="text-emerald-400"
        />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[11px]">
          <span className="text-red-400">
            Long {total > 0
              ? `${((long / total) * 100).toFixed(1)}%`
              : "0%"}
          </span>

          <span className="text-emerald-400">
            Short {total > 0
              ? `${((short / total) * 100).toFixed(1)}%`
              : "0%"}
          </span>
        </div>

        <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="bg-red-500"
            style={{
              width:
                total > 0
                  ? `${(long / total) * 100}%`
                  : "50%",
            }}
          />

          <div
            className="bg-emerald-500"
            style={{
              width:
                total > 0
                  ? `${(short / total) * 100}%`
                  : "50%",
            }}
          />
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        {total === 0
          ? "No liquidation data"
          : longDominant
          ? "Long liquidations dominate"
          : "Short liquidations dominate"}
      </div>
    </Card>
  );
}

interface LiquidationStatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

function LiquidationStat({
  label,
  value,
  icon,
  className,
}: LiquidationStatProps) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
      <div
        className={cn(
          "flex items-center gap-1 text-xs",
          className
        )}
      >
        {icon}
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-200">
        {formatUsd(value)}
      </div>
    </div>
  );
}

