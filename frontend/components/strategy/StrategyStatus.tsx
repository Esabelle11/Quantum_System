
"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export type RuntimeStrategyStatus =
  | "RUNNING"
  | "PAUSED"
  | "STOPPED"
  | "ERROR"
  | "STARTING";

interface StrategyStatusProps {
  status: RuntimeStrategyStatus;

  lastSignal?: {
    type: "LONG" | "SHORT" | "EXIT" | "NONE";
    timestamp: string;
    price?: number;
  };

  lastExecution?: string;

  message?: string;

  compact?: boolean;
}

export default function StrategyStatus({
  status,
  lastSignal,
  lastExecution,
  message,
  compact = false,
}: StrategyStatusProps) {
  const config =
    STATUS_CONFIG[status];

  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${config.iconClass}`}
        />

        <Badge variant={config.variant}>
          {status}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon
              className={`h-5 w-5 ${config.iconClass}`}
            />

            <h3 className="text-sm font-semibold text-white">
              Strategy Runtime
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Current execution state of the strategy.
          </p>
        </div>

        <Badge variant={config.variant}>
          {status}
        </Badge>
      </div>

      {message && (
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400">
          {message}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatusItem
          label="Last Signal"
          value={
            lastSignal
              ? lastSignal.type
              : "NONE"
          }
        />

        <StatusItem
          label="Signal Time"
          value={
            lastSignal?.timestamp
              ? formatDate(
                  lastSignal.timestamp
                )
              : "--"
          }
        />

        <StatusItem
          label="Signal Price"
          value={
            lastSignal?.price ===
            undefined
              ? "--"
              : `$${lastSignal.price.toLocaleString()}`
          }
        />

        <StatusItem
          label="Last Execution"
          value={
            lastExecution
              ? formatDate(lastExecution)
              : "--"
          }
        />
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <Activity className="h-3.5 w-3.5" />

        {config.description}
      </div>
    </Card>
  );
}

const STATUS_CONFIG: Record<
  RuntimeStrategyStatus,
  {
    icon: React.ElementType;
    iconClass: string;
    variant:
      | "success"
      | "warning"
      | "default"
      | "danger";
    description: string;
  }
> = {
  RUNNING: {
    icon: PlayCircle,
    iconClass: "text-emerald-400",
    variant: "success",
    description:
      "Strategy is actively evaluating market conditions.",
  },

  PAUSED: {
    icon: PauseCircle,
    iconClass: "text-yellow-400",
    variant: "warning",
    description:
      "Strategy is paused and will not generate new executions.",
  },

  STOPPED: {
    icon: XCircle,
    iconClass: "text-slate-500",
    variant: "default",
    description:
      "Strategy is stopped.",
  },

  ERROR: {
    icon: AlertTriangle,
    iconClass: "text-red-400",
    variant: "danger",
    description:
      "Strategy encountered an execution error.",
  },

  STARTING: {
    icon: Clock,
    iconClass: "text-blue-400",
    variant: "default",
    description:
      "Strategy is initializing.",
  },
};

function StatusItem({
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

  return date.toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}