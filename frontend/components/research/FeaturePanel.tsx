
// frontend/components/research/FeaturePanel.tsx

import {
  Activity,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface FeatureValue {
  id: string;
  name: string;
  value: number | string | null;
  unit?: string;
  change?: number | null;
  interpretation?: string;
  category?: string;
}

interface FeaturePanelProps {
  features: FeatureValue[];
  loading?: boolean;
}

function formatValue(
  value: number | string | null,
  unit?: string
) {
  if (value === null) {
    return "--";
  }

  if (typeof value === "number") {
    const formatted =
      Math.abs(value) >= 1000
        ? value.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
            }
          )
        : value.toFixed(4);

    return `${formatted}${unit ?? ""}`;
  }

  return `${value}${unit ?? ""}`;
}

export default function FeaturePanel({
  features,
  loading = false,
}: FeaturePanelProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 rounded bg-slate-900"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-blue-400" />

        <h3 className="text-sm font-semibold text-white">
          Feature Values
        </h3>
      </div>

      {features.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-600">
          No feature data available.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {features.map((feature) => {
            const positive =
              (feature.change ?? 0) >= 0;

            return (
              <div
                key={feature.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">
                      {feature.category ??
                        "Feature"}
                    </div>

                    <div className="mt-1 text-sm font-medium text-slate-200">
                      {feature.name}
                    </div>
                  </div>

                  {feature.change !==
                    null &&
                    feature.change !==
                      undefined && (
                      <Badge
                        variant={
                          positive
                            ? "success"
                            : "danger"
                        }
                      >
                        {positive
                          ? "+"
                          : ""}
                        {feature.change.toFixed(
                          2
                        )}
                      </Badge>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xl font-semibold text-white">
                    {formatValue(
                      feature.value,
                      feature.unit
                    )}
                  </span>

                  {feature.change !==
                    null &&
                    feature.change !==
                      undefined &&
                    (positive ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    ))}
                </div>

                {feature.interpretation && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {feature.interpretation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}