
"use client";

import Card from "@/components/ui/Card";
import DrawdownChartComponent from "@/components/charts/DrawdownChart";

interface DrawdownPoint {
  timestamp: string | number;
  drawdown: number;
}

interface BacktestDrawdownChartProps {
  data: DrawdownPoint[];
  loading?: boolean;
}

export default function DrawdownChart({
  data,
  loading = false,
}: BacktestDrawdownChartProps) {
  return (
    <Card className="p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">
          Drawdown
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Portfolio drawdown from the previous equity peak.
        </p>
      </div>

      <div className="h-[300px]">
        {loading ? (
          <div className="h-full animate-pulse rounded-lg bg-slate-900" />
        ) : (
          <DrawdownChartComponent
            data={data}
          />
        )}
      </div>
    </Card>
  );
}