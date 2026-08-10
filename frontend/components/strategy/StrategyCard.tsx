
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Calendar,
  Settings2,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export type StrategyStatus =
  | "ACTIVE"
  | "PAUSED"
  | "DRAFT"
  | "ERROR";

export interface Strategy {
  id: string;
  name: string;
  description?: string;

  symbol: string;
  timeframe: string;

  status: StrategyStatus;

  signalType?: string;
  regimeType?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface StrategyCardProps {
  strategy: Strategy;
  onActivate?: (strategy: Strategy) => void;
  onPause?: (strategy: Strategy) => void;
  onDelete?: (strategy: Strategy) => void;
}

export default function StrategyCard({
  strategy,
  onActivate,
  onPause,
}: StrategyCardProps) {
  return (
    <Card className="p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">
              {strategy.name}
            </h3>

            <StatusBadge status={strategy.status} />
          </div>

          {strategy.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
              {strategy.description}
            </p>
          )}
        </div>

        <Activity className="h-5 w-5 shrink-0 text-slate-600" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoItem
          label="Symbol"
          value={strategy.symbol}
        />

        <InfoItem
          label="Timeframe"
          value={strategy.timeframe}
        />

        <InfoItem
          label="Signal"
          value={strategy.signalType ?? "Not configured"}
        />

        <InfoItem
          label="Regime"
          value={strategy.regimeType ?? "Not configured"}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <Calendar className="h-3.5 w-3.5" />

          {strategy.updatedAt
            ? formatDate(strategy.updatedAt)
            : "No update"}
        </div>

        <div className="flex items-center gap-2">
          {strategy.status === "ACTIVE" && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onPause?.(strategy)}
            >
              Pause
            </Button>
          )}

          {strategy.status !== "ACTIVE" && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onActivate?.(strategy)}
            >
              Activate
            </Button>
          )}

          <Link
            href={`/strategy/${strategy.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            View
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status: StrategyStatus;
}) {
  const variants: Record<
    StrategyStatus,
    "success" | "warning" | "default" | "danger"
  > = {
    ACTIVE: "success",
    PAUSED: "warning",
    DRAFT: "default",
    ERROR: "danger",
  };

  return (
    <Badge variant={variants[status]}>
      {status}
    </Badge>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1 truncate text-xs font-medium text-slate-300">
        {value}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}