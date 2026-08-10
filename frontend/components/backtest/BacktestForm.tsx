
"use client";

import { FormEvent, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface BacktestFormValues {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  strategyId: string;
  commission: number;
  slippage: number;
}

interface BacktestFormProps {
  strategies?: {
    id: string;
    name: string;
  }[];

  defaultValues?: Partial<BacktestFormValues>;

  loading?: boolean;

  onSubmit?: (
    values: BacktestFormValues
  ) => void;
}

const defaultForm: BacktestFormValues = {
  symbol: "BTCUSDT",
  timeframe: "1h",
  startDate: "",
  endDate: "",
  initialCapital: 10000,
  strategyId: "",
  commission: 0.0006,
  slippage: 0.0005,
};

export default function BacktestForm({
  strategies = [],
  defaultValues,
  loading = false,
  onSubmit,
}: BacktestFormProps) {
  const [form, setForm] =
    useState<BacktestFormValues>({
      ...defaultForm,
      ...defaultValues,
    });

  const updateField = <
    K extends keyof BacktestFormValues
  >(
    field: K,
    value: BacktestFormValues[K]
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

  const reset = () => {
    setForm({
      ...defaultForm,
      ...defaultValues,
    });
  };

  return (
    <Card className="p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">
          Backtest Configuration
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Configure the historical simulation before running the backtest.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Symbol">
            <select
              value={form.symbol}
              onChange={(e) =>
                updateField(
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
                updateField(
                  "timeframe",
                  e.target.value
                )
              }
              className="field"
            >
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
              <option value="15m">
                15 minutes
              </option>
              <option value="1h">1 hour</option>
              <option value="4h">4 hours</option>
              <option value="1d">1 day</option>
            </select>
          </Field>

          <Field label="Start Date">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                updateField(
                  "startDate",
                  e.target.value
                )
              }
              className="field"
              required
            />
          </Field>

          <Field label="End Date">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                updateField(
                  "endDate",
                  e.target.value
                )
              }
              className="field"
              required
            />
          </Field>

          <Field label="Strategy">
            <select
              value={form.strategyId}
              onChange={(e) =>
                updateField(
                  "strategyId",
                  e.target.value
                )
              }
              className="field"
              required
            >
              <option value="">
                Select strategy
              </option>

              {strategies.map(
                (strategy) => (
                  <option
                    key={strategy.id}
                    value={strategy.id}
                  >
                    {strategy.name}
                  </option>
                )
              )}
            </select>
          </Field>

          <Field label="Initial Capital">
            <input
              type="number"
              min="0"
              step="100"
              value={form.initialCapital}
              onChange={(e) =>
                updateField(
                  "initialCapital",
                  Number(e.target.value)
                )
              }
              className="field"
            />
          </Field>

          <Field label="Commission">
            <input
              type="number"
              min="0"
              step="0.0001"
              value={form.commission}
              onChange={(e) =>
                updateField(
                  "commission",
                  Number(e.target.value)
                )
              }
              className="field"
            />
          </Field>

          <Field label="Slippage">
            <input
              type="number"
              min="0"
              step="0.0001"
              value={form.slippage}
              onChange={(e) =>
                updateField(
                  "slippage",
                  Number(e.target.value)
                )
              }
              className="field"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={reset}
            disabled={loading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            <Play className="mr-2 h-4 w-4" />

            {loading
              ? "Running..."
              : "Run Backtest"}
          </Button>
        </div>
      </form>

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