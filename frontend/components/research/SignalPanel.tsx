
// frontend/components/research/SignalPanel.tsx

import {
  ArrowDown,
  ArrowUp,
  Minus,
  Zap,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { cn } from "@/lib/utils";

type SignalDirection =
  | "LONG"
  | "SHORT"
  | "NEUTRAL";

interface SignalPanelProps {
  signal: SignalDirection;
  strength?: number | null;
  confidence?: number | null;
  reason?: string;
  timestamp?: string;
  loading?: boolean;
}

export default function SignalPanel({
  signal,
  strength,
  confidence,
  reason,
  timestamp,
  loading = false,
}: SignalPanelProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-24 rounded bg-slate-800" />
          <div className="h-10 w-32 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const isLong =
    signal === "LONG";

  const isShort =
    signal === "SHORT";

  const Icon = isLong
    ? ArrowUp
    : isShort
    ? ArrowDown
    : Minus;

  const signalClass = isLong
    ? "text-emerald-400"
    : isShort
    ? "text-red-400"
    : "text-slate-400";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400" />

          <h3 className="text-sm font-semibold text-white">
            Current Signal
          </h3>
        </div>

        <Badge
          variant={
            isLong
              ? "success"
              : isShort
              ? "danger"
              : "default"
          }
        >
          {signal}
        </Badge>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950",
            signalClass
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <div
            className={cn(
              "text-2xl font-semibold",
              signalClass
            )}
          >
            {signal}
          </div>

          {timestamp && (
            <div className="mt-1 text-xs text-slate-500">
              {timestamp}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <ProgressMetric
          label="Strength"
          value={strength}
        />

        <ProgressMetric
          label="Confidence"
          value={confidence}
        />
      </div>

      {reason && (
        <div className="mt-5 border-t border-slate-800 pt-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-600">
            Signal Reason
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {reason}
          </p>
        </div>
      )}
    </Card>
  );
}

interface ProgressMetricProps {
  label: string;
  value?: number | null;
}

function ProgressMetric({
  label,
  value,
}: ProgressMetricProps) {
  const normalized =
    value === null ||
    value === undefined
      ? null
      : Math.max(
          0,
          Math.min(100, value)
        );

  return (
    <div>
      <div className="flex justify-between">
        <span className="text-xs text-slate-500">
          {label}
        </span>

        <span className="text-xs font-medium text-slate-300">
          {normalized === null
            ? "--"
            : `${normalized.toFixed(
                1
              )}%`}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{
            width:
              normalized === null
                ? "0%"
                : `${normalized}%`,
          }}
        />
      </div>
    </div>
  );
}