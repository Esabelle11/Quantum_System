
// frontend/components/charts/DrawdownChart.tsx

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
  EquityPoint,
} from "@/types/backtest";

import {
  cn,
} from "@/lib/utils";

interface DrawdownChartProps {
  data: EquityPoint[];

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

export default function DrawdownChart({
  data,
  height = 260,
  className,
}: DrawdownChartProps) {
  const chartData = data.map(
    (point) => ({
      timestamp:
        point.timestamp,

      date: formatDate(
        point.timestamp
      ),

      drawdown:
        point.drawdownPct ??
        point.drawdown ??
        0,
    })
  );

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
            tickFormatter={(value) =>
              `${Number(value).toFixed(1)}%`
            }
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
              `${Number(value).toFixed(2)}%`,
              "Drawdown",
            ]}
          />

          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#f87171"
            fill="#ef4444"
            fillOpacity={0.12}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

