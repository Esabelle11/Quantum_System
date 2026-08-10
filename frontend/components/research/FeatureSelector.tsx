
// frontend/components/research/FeatureSelector.tsx

"use client";

import {
  Check,
  ChevronDown,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface FeatureOption {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

interface FeatureSelectorProps {
  features: FeatureOption[];
  selectedFeatures: string[];
  onChange: (
    featureIds: string[]
  ) => void;
  disabled?: boolean;
}

export default function FeatureSelector({
  features,
  selectedFeatures,
  onChange,
  disabled = false,
}: FeatureSelectorProps) {
  const toggleFeature = (
    featureId: string
  ) => {
    if (selectedFeatures.includes(featureId)) {
      onChange(
        selectedFeatures.filter(
          (id) => id !== featureId
        )
      );

      return;
    }

    onChange([
      ...selectedFeatures,
      featureId,
    ]);
  };

  const grouped = features.reduce<
    Record<string, FeatureOption[]>
  >((groups, feature) => {
    const category =
      feature.category ?? "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(feature);

    return groups;
  }, {});

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Research Features
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Select quantitative features to investigate.
          </p>
        </div>

        <span className="text-xs text-slate-500">
          {selectedFeatures.length} selected
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {Object.entries(grouped).map(
          ([category, categoryFeatures]) => (
            <div key={category}>
              <div className="mb-2 flex items-center gap-2">
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />

                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {category}
                </span>
              </div>

              <div className="space-y-2">
                {categoryFeatures.map(
                  (feature) => {
                    const selected =
                      selectedFeatures.includes(
                        feature.id
                      );

                    return (
                      <button
                        key={feature.id}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          toggleFeature(
                            feature.id
                          )
                        }
                        className={[
                          "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition",
                          selected
                            ? "border-blue-500/40 bg-blue-500/5"
                            : "border-slate-800 bg-slate-950 hover:border-slate-700",
                          disabled
                            ? "cursor-not-allowed opacity-50"
                            : "",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            selected
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-700",
                          ].join(" ")}
                        >
                          {selected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-200">
                            {feature.name}
                          </div>

                          {feature.description && (
                            <div className="mt-1 text-xs leading-5 text-slate-500">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )
        )}
      </div>

      {selectedFeatures.length > 0 && (
        <div className="mt-5 border-t border-slate-800 pt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onChange([])}
            disabled={disabled}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </Card>
  );
}
