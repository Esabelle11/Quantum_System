
"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";

export type RegimeType =
  | "TRENDING"
  | "RANGING"
  | "HIGH_VOLATILITY"
  | "LOW_VOLATILITY"
  | "AUTO";

export interface RegimeConfigValue {
  enabled: boolean;
  type: RegimeType;

  lookbackPeriod: number;

  volatilityThreshold: number;

  trendThreshold: number;

  allowUnknownRegime: boolean;
}

interface RegimeConfigProps {
  value?: Partial<RegimeConfigValue>;

  onChange?: (
    value: RegimeConfigValue
  ) => void;
}

const defaultConfig: RegimeConfigValue = {
  enabled: true,
  type: "AUTO",

  lookbackPeriod: 50,

  volatilityThreshold: 0.02,

  trendThreshold: 0.5,

  allowUnknownRegime: false,
};

export default function RegimeConfig({
  value,
  onChange,
}: RegimeConfigProps) {
  const [config, setConfig] =
    useState<RegimeConfigValue>({
      ...defaultConfig,
      ...value,
    });

  useEffect(() => {
    if (value) {
      setConfig((current) => ({
        ...current,
        ...value,
      }));
    }
  }, [value]);

  const update = <
    K extends keyof RegimeConfigValue
  >(
    field: K,
    newValue: RegimeConfigValue[K]
  ) => {
    const next = {
      ...config,
      [field]: newValue,
    };

    setConfig(next);
    onChange?.(next);
  };

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Market Regime
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Configure how the strategy responds to different market conditions.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            update(
              "enabled",
              !config.enabled
            )
          }
          className={`relative h-6 w-11 rounded-full transition ${
            config.enabled
              ? "bg-blue-600"
              : "bg-slate-800"
          }`}
          aria-label="Toggle regime detection"
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
              config.enabled
                ? "left-6"
                : "left-1"
            }`}
          />
        </button>
      </div>

      <div
        className={`space-y-5 ${
          !config.enabled
            ? "pointer-events-none opacity-50"
            : ""
        }`}
      >
        <Field label="Regime Detection">
          <select
            value={config.type}
            onChange={(e) =>
              update(
                "type",
                e.target.value as RegimeType
              )
            }
            className="field"
          >
            <option value="AUTO">
              Automatic
            </option>

            <option value="TRENDING">
              Trending
            </option>

            <option value="RANGING">
              Ranging
            </option>

            <option value="HIGH_VOLATILITY">
              High Volatility
            </option>

            <option value="LOW_VOLATILITY">
              Low Volatility
            </option>
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Lookback Period"
            value={config.lookbackPeriod}
            min={1}
            onChange={(value) =>
              update(
                "lookbackPeriod",
                value
              )
            }
          />

          <NumberField
            label="Volatility Threshold"
            value={config.volatilityThreshold}
            min={0}
            step={0.001}
            onChange={(value) =>
              update(
                "volatilityThreshold",
                value
              )
            }
          />

          <NumberField
            label="Trend Threshold"
            value={config.trendThreshold}
            step={0.01}
            onChange={(value) =>
              update(
                "trendThreshold",
                value
              )
            }
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div>
            <div className="text-xs font-medium text-slate-300">
              Allow Unknown Regime
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              Allow the strategy to trade when the regime cannot be classified.
            </div>
          </div>

          <input
            type="checkbox"
            checked={
              config.allowUnknownRegime
            }
            onChange={(e) =>
              update(
                "allowUnknownRegime",
                e.target.checked
              )
            }
            className="h-4 w-4 rounded border-slate-700 bg-slate-900"
          />
        </label>
      </div>

      <style jsx>{`
        .field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(30 41 59);
          background: rgb(2 6 23);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(226 232 240);
          outline: none;
        }

        .field:focus {
          border-color: rgb(59 130 246);
        }
      `}</style>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-400">
        {label}
      </span>

      {children}
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="field"
      />
    </Field>
  );
}