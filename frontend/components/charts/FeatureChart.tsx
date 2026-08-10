
// frontend/components/charts/FeatureChart.tsx

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
  FeatureCategory,
  FeatureSnapshot,
} from "@/types/features";

import {
  cn,
} from "@/lib/utils";

interface FeatureChartProps {
  data: FeatureSnapshot[];

  category: FeatureCategory;

  feature: string;

  title?: string;

  height?: number;

  className?: string;

  stroke?: string;
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
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function getFeatureValue(
  snapshot: FeatureSnapshot,
  category: FeatureCategory,
  feature: string
): number | null {
  const categoryData =
    snapshot[category];

  if (!categoryData) {
    return null;
  }

  const value =
    categoryData[feature];

  if (
    typeof value !==
    "number"
  ) {
    return null;
  }

  return value;
}

export default function FeatureChart({
  data,
  category,
  feature,
  title,
  height = 280,
  className,
  stroke = "#38bdf8",
}: FeatureChartProps) {
  const chartData = data
    .map((snapshot) => ({
      timestamp:
        snapshot.timestamp,

      date: formatDate(
        snapshot.timestamp
      ),

      value: getFeatureValue(
        snapshot,
        category,
        feature
      ),
    }))
    .filter(
      (point) =>
        point.value !== null
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
      {title && (
        <div className="mb-3">
          <h3 className="text-sm font-medium text-slate-200">
            {title}
          </h3>

          <p className="text-xs text-slate-500">
            {category} / {feature}
          </p>
        </div>
      )}

      <div
        className="w-full"
        style={{
          height: title
            ? height - 40
            : height,
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
                fontSize: 10,
              }}
              axisLine={{
                stroke: "#1e293b",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 10,
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
                    maximumFractionDigits: 6,
                  }
                ),
                feature,
              ]}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
              }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

