
// frontend/components/charts/PnLChart.tsx

"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  BacktestTrade,
} from "@/types/backtest";

import {
  cn,
} from "@/lib/utils";

interface PnLChartProps {
  trades: BacktestTrade[];

  height?: number;

  className?: string;
}

function formatDate(
  timestamp: number
) {
  return new Date(
    timestamp
  ).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  );
}

export default function PnLChart({
  trades,
  height = 280,
  className,
}: PnLChartProps) {
  let cumulativePnl = 0;

  const chartData = [
    ...trades,
  ]
    .sort(
      (a, b) =>
        a.timestamp -
        b.timestamp
    )
    .map((trade) => {
      cumulativePnl +=
        trade.pnl ?? 0;

      return {
        timestamp:
          trade.timestamp,

        date: formatDate(
          trade.timestamp
        ),

        pnl: trade.pnl ?? 0,

        cumulativePnl,
      };
    });

  return (
    <div
      className={cn(
        "w-full",
        className
      )}
      style={{
        height,
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tick={{
              fill: "#64748b",
              fontSize: 11,
            }}
            axisLine={{
              stroke: "#1e293b",
            }}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748b",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background:
                "#0f172a",

              border:
                "1px solid #334155",

              borderRadius:
                "6px",
            }}
            formatter={(
              value
            ) => [
              Number(value).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              ),
              "Cumulative PnL",
            ]}
          />

          <Area
            type="monotone"
            dataKey="cumulativePnl"
            stroke="#a78bfa"
            fill="#8b5cf6"
            fillOpacity={0.12}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

