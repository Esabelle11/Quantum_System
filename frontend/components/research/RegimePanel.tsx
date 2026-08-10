
// frontend/components/research/RegimePanel.tsx

import {
  Activity,
  Gauge,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface RegimePanelProps {
  regime: string | null;
  confidence?: number | null;
  volatility?: number | null;
  trendStrength?: number | null;
  description?: string;
  loading?: boolean;
}

export default function RegimePanel({
  regime,
  confidence,
  volatility,
  trendStrength,
  description,
  loading = false,
}: RegimePanelProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-20 rounded bg-slate-800" />
          <div className="h-8 w-40 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const normalizedRegime =
    regime?.toUpperCase() ??
    "UNKNOWN";

  const trending =
    normalizedRegime.includes(
      "TREND"
    );

  const bullish =
    normalizedRegime.includes(
      "BULL"
    );

  const bearish =
    normalizedRegime.includes(
      "BEAR"
    );

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-violet-400" />

          <h3 className="text-sm font-semibold text-white">
            Market Regime
          </h3>
        </div>

        <Badge
          variant={
            bullish
              ? "success"
              : bearish
              ? "danger"
              : "default"
          }
        >
          {normalizedRegime}
        </Badge>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
          {bullish || trending ? (
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          ) : bearish ? (
            <TrendingDown className="h-5 w-5 text-red-400" />
          ) : (
            <Activity className="h-5 w-5 text-slate-400" />
          )}
        </div>

        <div>
          <div className="text-xl font-semibold text-white">
            {normalizedRegime}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Detected market state
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Metric
          label="Confidence"
          value={confidence}
          suffix="%"
        />

        <Metric
          label="Volatility"
          value={volatility}
        />

        <Metric
          label="Trend Strength"
          value={trendStrength}
        />
      </div>

      {description && (
        <div className="mt-5 border-t border-slate-800 pt-4">
          <p className="text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      )}
    </Card>
  );
}

interface MetricProps {
  label: string;
  value?: number | null;
  suffix?: string;
}

function Metric({
  label,
  value,
  suffix = "",
}: MetricProps) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-200">
        {value === null ||
        value === undefined
          ? "--"
          : `${value.toFixed(2)}${suffix}`}
      </div>
    </div>
  );
}