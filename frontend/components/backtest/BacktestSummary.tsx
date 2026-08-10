
import {
  Calendar,
  Clock,
  Database,
  Wallet,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface BacktestSummaryProps {
  symbol: string;
  timeframe: string;
  strategy: string;

  startDate: string;
  endDate: string;

  initialCapital: number;
  finalCapital: number;

  totalTrades: number;

  status?: "COMPLETED" | "RUNNING" | "FAILED";
}

export default function BacktestSummary({
  symbol,
  timeframe,
  strategy,
  startDate,
  endDate,
  initialCapital,
  finalCapital,
  totalTrades,
  status = "COMPLETED",
}: BacktestSummaryProps) {
  const pnl =
    finalCapital - initialCapital;

  const returnPercent =
    initialCapital === 0
      ? 0
      : (pnl / initialCapital) * 100;

  const positive = pnl >= 0;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              {symbol}
            </h2>

            <Badge
              variant={
                status === "COMPLETED"
                  ? "success"
                  : status === "FAILED"
                  ? "danger"
                  : "warning"
              }
            >
              {status}
            </Badge>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {strategy}
          </p>
        </div>

        <div className="text-right">
          <div
            className={
              positive
                ? "text-xl font-semibold text-emerald-400"
                : "text-xl font-semibold text-red-400"
            }
          >
            {positive ? "+" : ""}
            {returnPercent.toFixed(2)}%
          </div>

          <div className="text-xs text-slate-500">
            Total Return
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem
          icon={Calendar}
          label="Period"
          value={`${startDate} → ${endDate}`}
        />

        <SummaryItem
          icon={Clock}
          label="Timeframe"
          value={timeframe}
        />

        <SummaryItem
          icon={Wallet}
          label="Capital"
          value={`$${initialCapital.toLocaleString()}`}
        />

        <SummaryItem
          icon={Database}
          label="Trades"
          value={totalTrades.toLocaleString()}
        />
      </div>
    </Card>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <div className="mt-2 text-sm font-medium text-slate-200">
        {value}
      </div>
    </div>
  );
}