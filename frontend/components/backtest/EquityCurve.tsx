
"use client";

import Card from "@/components/ui/Card";
import EquityCurveChart from "@/components/charts/EquityCurve";

interface EquityPoint {
  timestamp: string | number;
  equity: number;
}

interface BacktestEquityCurveProps {
  data: EquityPoint[];
  initialCapital?: number;
  loading?: boolean;
}

export default function EquityCurve({
  data,
  initialCapital,
  loading = false,
}: BacktestEquityCurveProps) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Equity Curve
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Portfolio equity throughout the backtest.
          </p>
        </div>

        {initialCapital !==
          undefined && (
          <div className="text-xs text-slate-500">
            Initial: $
            {initialCapital.toLocaleString()}
          </div>
        )}
      </div>

      <div className="h-[360px]">
        {loading ? (
          <div className="h-full animate-pulse rounded-lg bg-slate-900" />
        ) : (
          <EquityCurveChart
            data={data}
          />
        )}
      </div>
    </Card>
  );
}