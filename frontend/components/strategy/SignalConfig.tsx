
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

export type SignalType =
  | "MOMENTUM"
  | "MEAN_REVERSION"
  | "BREAKOUT"
  | "TREND_FOLLOWING"
  | "CUSTOM";

export interface SignalConfigValue {
  type: SignalType;

  fastPeriod: number;
  slowPeriod: number;

  entryThreshold: number;
  exitThreshold: number;

  confirmationRequired: boolean;
}

interface SignalConfigProps {
  value?: Partial<SignalConfigValue>;

  onChange?: (
    value: SignalConfigValue
  ) => void;
}

const defaultConfig: SignalConfigValue = {
  type: "MOMENTUM",

  fastPeriod: 20,
  slowPeriod: 50,

  entryThreshold: 0,
  exitThreshold: 0,

  confirmationRequired: true,
};

export default function SignalConfig({
  value,
  onChange,
}: SignalConfigProps) {
  const [config, setConfig] =
    useState<SignalConfigValue>({
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
    K extends keyof SignalConfigValue
  >(
    field: K,
    newValue: SignalConfigValue[K]
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
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">
          Signal Configuration
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Define how the strategy generates entry and exit signals.
        </p>
      </div>

      <div className="space-y-5">
        <Field label="Signal Type">
          <select
            value={config.type}
            onChange={(e) =>
              update(
                "type",
                e.target.value as SignalType
              )
            }
            className="field"
          >
            <option value="MOMENTUM">
              Momentum
            </option>

            <option value="MEAN_REVERSION">
              Mean Reversion
            </option>

            <option value="BREAKOUT">
              Breakout
            </option>

            <option value="TREND_FOLLOWING">
              Trend Following
            </option>

            <option value="CUSTOM">
              Custom
            </option>
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Fast Period"
            value={config.fastPeriod}
            min={1}
            onChange={(value) =>
              update("fastPeriod", value)
            }
          />

          <NumberField
            label="Slow Period"
            value={config.slowPeriod}
            min={1}
            onChange={(value) =>
              update("slowPeriod", value)
            }
          />

          <NumberField
            label="Entry Threshold"
            value={config.entryThreshold}
            step={0.01}
            onChange={(value) =>
              update(
                "entryThreshold",
                value
              )
            }
          />

          <NumberField
            label="Exit Threshold"
            value={config.exitThreshold}
            step={0.01}
            onChange={(value) =>
              update(
                "exitThreshold",
                value
              )
            }
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div>
            <div className="text-xs font-medium text-slate-300">
              Confirmation Required
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              Require additional confirmation before generating a signal.
            </div>
          </div>

          <input
            type="checkbox"
            checked={
              config.confirmationRequired
            }
            onChange={(e) =>
              update(
                "confirmationRequired",
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