
// frontend/components/market/FundingCard.tsx

import {
  ArrowDown,
  ArrowUp,
  Clock3,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { cn } from "@/lib/utils";

interface FundingCardProps {
  fundingRate: number | null;
  nextFundingTime?: number | null;
  loading?: boolean;
}

function formatFundingRate(
  rate: number | null
) {
  if (rate === null) {
    return "--";
  }

  return `${(
    rate * 100
  ).toFixed(4)}%`;
}

function formatAnnualized(
  rate: number | null
) {
  if (rate === null) {
    return "--";
  }

  const annualized =
    rate * 100 * 3 * 365;

  return `${annualized.toFixed(
    2
  )}%`;
}

function formatTime(
  timestamp?: number | null
) {
  if (!timestamp) {
    return "--";
  }

  return new Date(
    timestamp
  ).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function FundingCard({
  fundingRate,
  nextFundingTime,
  loading = false,
}: FundingCardProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-slate-800" />
          <div className="h-8 w-32 rounded bg-slate-800" />
          <div className="h-4 w-40 rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const positive =
    (fundingRate ?? 0) >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          Funding Rate
        </span>

        <Badge
          variant={
            positive
              ? "success"
              : "danger"
          }
        >
          {positive
            ? "Longs Pay"
            : "Shorts Pay"}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {positive ? (
          <ArrowUp className="h-5 w-5 text-emerald-400" />
        ) : (
          <ArrowDown className="h-5 w-5 text-red-400" />
        )}

        <span
          className={cn(
            "text-2xl font-semibold",
            positive
              ? "text-emerald-400"
              : "text-red-400"
          )}
        >
          {formatFundingRate(
            fundingRate
          )}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500">
            Annualized
          </div>

          <div className="mt-1 text-sm font-medium text-slate-200">
            {formatAnnualized(
              fundingRate
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-500">
            <Clock3 className="h-3 w-3" />
            Next Funding
          </div>

          <div className="mt-1 text-sm font-medium text-slate-200">
            {formatTime(
              nextFundingTime
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

