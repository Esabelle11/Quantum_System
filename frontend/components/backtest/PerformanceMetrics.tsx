
import {
  Activity,
  BarChart3,
  CircleDollarSign,
  Percent,
  ShieldAlert,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";

interface PerformanceMetricsProps {
  totalReturn: number;
  annualizedReturn?: number;
  sharpeRatio?: number;
  sortinoRatio?: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor?: number;
  totalTrades: number;
  averageTrade?: number;
}

export default function PerformanceMetrics({
  totalReturn,
  annualizedReturn,
  sharpeRatio,
  sortinoRatio,
  maxDrawdown,
  winRate,
  profitFactor,
  totalTrades,
  averageTrade,
}: PerformanceMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={TrendingUp}
        label="Total Return"
        value={`${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%`}
        positive={totalReturn >= 0}
      />

      <MetricCard
        icon={Percent}
        label="Annualized Return"
        value={
          annualizedReturn === undefined
            ? "--"
            : `${annualizedReturn >= 0 ? "+" : ""}${annualizedReturn.toFixed(2)}%`
        }
        positive={
          annualizedReturn !== undefined &&
          annualizedReturn >= 0
        }
      />

      <MetricCard
        icon={Activity}
        label="Sharpe Ratio"
        value={
          sharpeRatio === undefined
            ? "--"
            : sharpeRatio.toFixed(2)
        }
      />

      <MetricCard
        icon={ShieldAlert}
        label="Max Drawdown"
        value={`${maxDrawdown.toFixed(2)}%`}
        negative
      />

      <MetricCard
        icon={Target}
        label="Win Rate"
        value={`${winRate.toFixed(2)}%`}
      />

      <MetricCard
        icon={BarChart3}
        label="Profit Factor"
        value={
          profitFactor === undefined
            ? "--"
            : profitFactor.toFixed(2)
        }
      />

      <MetricCard
        icon={CircleDollarSign}
        label="Average Trade"
        value={
          averageTrade === undefined
            ? "--"
            : `$${averageTrade.toFixed(2)}`
        }
        positive={
          averageTrade !== undefined &&
          averageTrade >= 0
        }
      />

      <MetricCard
        icon={TrendingDown}
        label="Total Trades"
        value={totalTrades.toLocaleString()}
      />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  positive,
  negative,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  let valueClass =
    "text-slate-100";

  if (positive) {
    valueClass =
      "text-emerald-400";
  }

  if (negative) {
    valueClass =
      "text-red-400";
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <div
        className={`mt-3 text-xl font-semibold ${valueClass}`}
      >
        {value}
      </div>
    </Card>
  );
}