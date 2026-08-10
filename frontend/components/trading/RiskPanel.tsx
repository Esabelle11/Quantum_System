
"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface RiskState {
  level: RiskLevel;

  dailyLoss: number;
  dailyLossLimit: number;

  exposure: number;
  exposureLimit: number;

  marginUsage: number;
  marginLimit: number;

  openPositions: number;
  maxOpenPositions: number;

  tradingAllowed: boolean;

  message?: string;
}

interface RiskPanelProps {
  risk: RiskState;

  loading?: boolean;
}

export default function RiskPanel({
  risk,
  loading = false,
}: RiskPanelProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-900" />

        <div className="mt-5 space-y-4">
          <div className="h-16 animate-pulse rounded-lg bg-slate-900" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-900" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-900" />
        </div>
      </Card>
    );
  }

  const config =
    RISK_CONFIG[risk.level];

  const Icon = config.icon;

  const dailyLossUsage =
    percentage(
      Math.abs(risk.dailyLoss),
      risk.dailyLossLimit
    );

  const exposureUsage =
    percentage(
      risk.exposure,
      risk.exposureLimit
    );

  const marginUsage =
    percentage(
      risk.marginUsage,
      risk.marginLimit
    );

  const positionUsage =
    percentage(
      risk.openPositions,
      risk.maxOpenPositions
    );

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon
              className={`h-5 w-5 ${config.iconClass}`}
            />

            <h3 className="text-sm font-semibold text-white">
              Risk Monitor
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Current portfolio risk controls and limits.
          </p>
        </div>

        <Badge variant={config.variant}>
          {risk.level}
        </Badge>
      </div>

      <div
        className={`mt-5 flex items-center gap-3 rounded-lg border p-4 ${
          risk.tradingAllowed
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-red-500/20 bg-red-500/5"
        }`}
      >
        {risk.tradingAllowed ? (
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-red-400" />
        )}

        <div>
          <div
            className={`text-xs font-medium ${
              risk.tradingAllowed
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {risk.tradingAllowed
              ? "Trading Allowed"
              : "Trading Blocked"}
          </div>

          <div className="mt-1 text-[11px] text-slate-600">
            {risk.message ??
              (risk.tradingAllowed
                ? "Risk limits are currently within acceptable levels."
                : "One or more risk limits have been exceeded.")}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <RiskMetric
          label="Daily Loss"
          current={Math.abs(
            risk.dailyLoss
          )}
          limit={risk.dailyLossLimit}
          usage={dailyLossUsage}
          format={(value) =>
            `$${value.toFixed(2)}`
          }
        />

        <RiskMetric
          label="Exposure"
          current={risk.exposure}
          limit={risk.exposureLimit}
          usage={exposureUsage}
          format={(value) =>
            `$${value.toLocaleString()}`
          }
        />

        <RiskMetric
          label="Margin Usage"
          current={risk.marginUsage}
          limit={risk.marginLimit}
          usage={marginUsage}
          format={(value) =>
            `${value.toFixed(1)}%`
          }
        />

        <RiskMetric
          label="Open Positions"
          current={risk.openPositions}
          limit={risk.maxOpenPositions}
          usage={positionUsage}
          format={(value) =>
            value.toString()
          }
        />
      </div>
    </Card>
  );
}

function RiskMetric({
  label,
  current,
  limit,
  usage,
  format,
}: {
  label: string;
  current: number;
  limit: number;
  usage: number;
  format: (value: number) => string;
}) {
  const danger =
    usage >= 90;

  const warning =
    usage >= 70 && usage < 90;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-[11px] text-slate-600">
          {format(current)} /{" "}
          {format(limit)}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div
          className={`h-full rounded-full transition-all ${
            danger
              ? "bg-red-500"
              : warning
              ? "bg-yellow-500"
              : "bg-emerald-500"
          }`}
          style={{
            width: `${Math.min(
              usage,
              100
            )}%`,
          }}
        />
      </div>

      <div className="mt-1 flex justify-between">
        <span className="text-[10px] text-slate-600">
          {usage.toFixed(1)}% used
        </span>

        {danger && (
          <span className="flex items-center gap-1 text-[10px] text-red-400">
            <AlertTriangle className="h-3 w-3" />
            Limit approaching
          </span>
        )}
      </div>
    </div>
  );
}

const RISK_CONFIG: Record<
  RiskLevel,
  {
    icon: React.ElementType;
    iconClass: string;
    variant:
      | "success"
      | "warning"
      | "danger"
      | "default";
  }
> = {
  LOW: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    variant: "success",
  },

  MEDIUM: {
    icon: AlertTriangle,
    iconClass: "text-yellow-400",
    variant: "warning",
  },

  HIGH: {
    icon: AlertTriangle,
    iconClass: "text-orange-400",
    variant: "warning",
  },

  CRITICAL: {
    icon: ShieldAlert,
    iconClass: "text-red-400",
    variant: "danger",
  },
};

function percentage(
  current: number,
  limit: number
) {
  if (limit <= 0) {
    return 0;
  }

  return (current / limit) * 100;
}