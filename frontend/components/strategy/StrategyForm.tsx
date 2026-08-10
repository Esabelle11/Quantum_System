
"use client";

import {
  FormEvent,
  useState,
} from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import SignalConfig, {
  SignalConfigValue,
} from "./SignalConfig";

import RegimeConfig, {
  RegimeConfigValue,
} from "./RegimeConfig";

export interface StrategyFormValues {
  name: string;
  description: string;

  symbol: string;
  timeframe: string;

  signal: SignalConfigValue;
  regime: RegimeConfigValue;
}

interface StrategyFormProps {
  initialValues?: Partial<StrategyFormValues>;

  loading?: boolean;

  onSubmit?: (
    values: StrategyFormValues
  ) => void;

  onCancel?: () => void;
}

const defaultValues: StrategyFormValues = {
  name: "",
  description: "",

  symbol: "BTCUSDT",
  timeframe: "1h",

  signal: {
    type: "MOMENTUM",
    fastPeriod: 20,
    slowPeriod: 50,
    entryThreshold: 0,
    exitThreshold: 0,
    confirmationRequired: true,
  },

  regime: {
    enabled: true,
    type: "AUTO",
    lookbackPeriod: 50,
    volatilityThreshold: 0.02,
    trendThreshold: 0.5,
    allowUnknownRegime: false,
  },
};

export default function StrategyForm({
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}: StrategyFormProps) {
  const [form, setForm] =
    useState<StrategyFormValues>({
      ...defaultValues,
      ...initialValues,
      signal: {
        ...defaultValues.signal,
        ...initialValues?.signal,
      },
      regime: {
        ...defaultValues.regime,
        ...initialValues?.regime,
      },
    });

  const update = <
    K extends keyof StrategyFormValues
  >(
    field: K,
    value: StrategyFormValues[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSubmit?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card className="p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-white">
            Strategy Details
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Define the basic information for this trading strategy.
          </p>
        </div>

        <div className="space-y-5">
          <Field label="Strategy Name">
            <input
              type="text"
              value={form.name}
              placeholder="BTC Momentum Strategy"
              required
              onChange={(e) =>
                update(
                  "name",
                  e.target.value
                )
              }
              className="field"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              placeholder="Describe the strategy logic..."
              rows={4}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
              className="field resize-none"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Symbol">
              <select
                value={form.symbol}
                onChange={(e) =>
                  update(
                    "symbol",
                    e.target.value
                  )
                }
                className="field"
              >
                <option value="BTCUSDT">
                  BTCUSDT
                </option>

                <option value="ETHUSDT">
                  ETHUSDT
                </option>

                <option value="SOLUSDT">
                  SOLUSDT
                </option>
              </select>
            </Field>

            <Field label="Timeframe">
              <select
                value={form.timeframe}
                onChange={(e) =>
                  update(
                    "timeframe",
                    e.target.value
                  )
                }
                className="field"
              >
                <option value="1m">
                  1 minute
                </option>

                <option value="5m">
                  5 minutes
                </option>

                <option value="15m">
                  15 minutes
                </option>

                <option value="1h">
                  1 hour
                </option>

                <option value="4h">
                  4 hours
                </option>

                <option value="1d">
                  1 day
                </option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      <SignalConfig
        value={form.signal}
        onChange={(signal) =>
          update("signal", signal)
        }
      />

      <RegimeConfig
        value={form.regime}
        onChange={(regime) =>
          update("regime", regime)
        }
      />

      <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={
            loading ||
            !form.name.trim()
          }
        >
          {loading
            ? "Saving..."
            : "Save Strategy"}
        </Button>
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

        .field::placeholder {
          color: rgb(71 85 105);
        }

        .field:focus {
          border-color: rgb(59 130 246);
        }
      `}</style>
    </form>
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