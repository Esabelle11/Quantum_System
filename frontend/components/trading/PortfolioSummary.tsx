
import {
  CircleDollarSign,
  Gauge,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Card from "@/components/ui/Card";

interface PortfolioSummaryProps {
  equity: number;
  balance: number;

  availableBalance: number;

  unrealizedPnl: number;
  realizedPnl: number;

  marginUsed: number;

  totalExposure?: number;

  dailyPnl?: number;
}

export default function PortfolioSummary({
  equity,
  balance,
  availableBalance,
  unrealizedPnl,
  realizedPnl,
  marginUsed,
  totalExposure,
  dailyPnl,
}: PortfolioSummaryProps) {
  const pnlPositive =
    unrealizedPnl >= 0;

  const dailyPositive =
    (dailyPnl ?? 0) >= 0;

  const marginUsage =
    equity > 0
      ? (marginUsed / equity) * 100
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        icon={Wallet}
        label="Equity"
        value={`$${formatMoney(equity)}`}
      />

      <SummaryCard
        icon={CircleDollarSign}
        label="Available Balance"
        value={`$${formatMoney(
          availableBalance
        )}`}
      />

      <SummaryCard
        icon={
          pnlPositive
            ? TrendingUp
            : TrendingDown
        }
        label="Unrealized PnL"
        value={`${pnlPositive ? "+" : ""}$${formatMoney(
          unrealizedPnl
        )}`}
        valueClass={
          pnlPositive
            ? "text-emerald-400"
            : "text-red-400"
        }
      />

      <SummaryCard
        icon={
          dailyPositive
            ? TrendingUp
            : TrendingDown
        }
        label="Daily PnL"
        value={
          dailyPnl === undefined
            ? "--"
            : `${dailyPositive ? "+" : ""}$${formatMoney(
                dailyPnl
              )}`
        }
        valueClass={
          dailyPnl === undefined
            ? undefined
            : dailyPositive
            ? "text-emerald-400"
            : "text-red-400"
        }
      />

      <SummaryCard
        icon={Wallet}
        label="Wallet Balance"
        value={`$${formatMoney(balance)}`}
      />

      <SummaryCard
        icon={TrendingUp}
        label="Realized PnL"
        value={`$${formatMoney(
          realizedPnl
        )}`}
        valueClass={
          realizedPnl >= 0
            ? "text-emerald-400"
            : "text-red-400"
        }
      />

      <SummaryCard
        icon={Gauge}
        label="Margin Used"
        value={`$${formatMoney(
          marginUsed
        )}`}
      />

      <SummaryCard
        icon={Gauge}
        label="Margin Usage"
        value={`${marginUsage.toFixed(
          2
        )}%`}
      />

      {totalExposure !==
        undefined && (
        <div className="sm:col-span-2 lg:col-span-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total Exposure
              </span>

              <span className="text-sm font-semibold text-slate-200">
                $
                {formatMoney(
                  totalExposure
                )}
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-900">
              <div
                className="h-full rounded-full bg-slate-500"
                style={{
                  width: `${Math.min(
                    marginUsage,
                    100
                  )}%`,
                }}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <div
        className={`mt-3 text-lg font-semibold ${
          valueClass ??
          "text-slate-100"
        }`}
      >
        {value}
      </div>
    </Card>
  );
}

function formatMoney(
  value: number
) {
  return Math.abs(value).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}