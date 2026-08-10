
// frontend/components/charts/EquityCurve.tsx

"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
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

interface EquityCurveProps {
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

function formatValue(
  value: number
) {
  return value.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    }
  );
}

export default function EquityCurve({
  data,
  height = 320,
  className,
}: EquityCurveProps) {
  const chartData = data.map(
    (point) => ({
      timestamp:
        point.timestamp,

      date: formatDate(
        point.timestamp
      ),

      equity: point.equity,
    })
  );

  return (
    <div
      className={cn(
        "w-full rounded-lg",
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
        <LineChart
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
            tickFormatter={formatValue}
          />

          <Tooltip
            contentStyle={{
              background:
                "#0f172a",

              border:
                "1px solid #334155",

              borderRadius:
                "6px",

              color: "#f8fafc",
            }}
            formatter={(
              value
            ) => [
              formatValue(
                Number(value)
              ),
              "Equity",
            ]}
          />

          <Line
            type="monotone"
            dataKey="equity"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

