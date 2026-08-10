
// frontend/components/market/PriceCard.tsx

import {
  ArrowDownRight,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

import { cn } from "@/lib/utils";

interface PriceCardProps {
  symbol: string;
  price: number | null;
  change24h?: number | null;
  high24h?: number | null;
  low24h?: number | null;
  volume24h?: number | null;
  loading?: boolean;
}

function formatPrice(
  value: number | null | undefined
) {
  if (value === null || value === undefined) {
    return "--";
  }

  return value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

function formatVolume(
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

export default function PriceCard({
  symbol,
  price,
  change24h,
  high24h,
  low24h,
  volume24h,
  loading = false,
}: PriceCardProps) {
  const positive =
    (change24h ?? 0) >= 0;

  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-24" />

        <Skeleton className="mt-4 h-9 w-40" />

        <Skeleton className="mt-3 h-4 w-28" />

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />

          <span className="text-sm font-medium text-slate-300">
            {symbol}
          </span>
        </div>

        <span className="text-xs text-slate-500">
          Spot / Perpetual
        </span>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-3xl font-semibold tracking-tight text-white">
          $
          {formatPrice(price)}
        </span>

        {change24h !== null &&
          change24h !== undefined && (
            <span
              className={cn(
                "mb-1 flex items-center gap-1 text-sm font-medium",
                positive
                  ? "text-emerald-400"
                  : "text-red-400"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}

              {positive ? "+" : ""}
              {change24h.toFixed(2)}%
            </span>
          )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Metric
          label="24h High"
          value={`$${formatPrice(
            high24h
          )}`}
        />

        <Metric
          label="24h Low"
          value={`$${formatPrice(
            low24h
          )}`}
        />

        <Metric
          label="24h Volume"
          value={formatVolume(
            volume24h
          )}
        />
      </div>
    </Card>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-200">
        {value}
      </div>
    </div>
  );
}
