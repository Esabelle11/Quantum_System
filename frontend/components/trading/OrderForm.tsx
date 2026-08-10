
"use client";

import { FormEvent, useState } from "react";
import { ArrowDown, ArrowUp, Send } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";

export interface OrderFormValues {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  reduceOnly: boolean;
}

interface OrderFormProps {
  initialValues?: Partial<OrderFormValues>;

  loading?: boolean;

  disabled?: boolean;

  onSubmit?: (
    values: OrderFormValues
  ) => void;
}

const DEFAULT_VALUES: OrderFormValues = {
  symbol: "BTCUSDT",
  side: "BUY",
  type: "MARKET",
  quantity: 0.001,
  price: undefined,
  stopLoss: undefined,
  takeProfit: undefined,
  reduceOnly: false,
};

export default function OrderForm({
  initialValues,
  loading = false,
  disabled = false,
  onSubmit,
}: OrderFormProps) {
  const [form, setForm] =
    useState<OrderFormValues>({
      ...DEFAULT_VALUES,
      ...initialValues,
    });

  const update = <
    K extends keyof OrderFormValues
  >(
    field: K,
    value: OrderFormValues[K]
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

  const isDisabled =
    loading || disabled;

  return (
    <Card className="p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">
          Place Order
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Submit an order to the trading execution layer.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-2">
          <SideButton
            active={form.side === "BUY"}
            side="BUY"
            disabled={isDisabled}
            onClick={() =>
              update("side", "BUY")
            }
          />

          <SideButton
            active={form.side === "SELL"}
            side="SELL"
            disabled={isDisabled}
            onClick={() =>
              update("side", "SELL")
            }
          />
        </div>

        <Field label="Symbol">
          <select
            value={form.symbol}
            disabled={isDisabled}
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

        <Field label="Order Type">
          <select
            value={form.type}
            disabled={isDisabled}
            onChange={(e) =>
              update(
                "type",
                e.target.value as OrderType
              )
            }
            className="field"
          >
            <option value="MARKET">
              Market
            </option>

            <option value="LIMIT">
              Limit
            </option>
          </select>
        </Field>

        <Field label="Quantity">
          <input
            type="number"
            min="0"
            step="0.000001"
            value={form.quantity}
            disabled={isDisabled}
            onChange={(e) =>
              update(
                "quantity",
                Number(e.target.value)
              )
            }
            className="field"
          />
        </Field>

        {form.type === "LIMIT" && (
          <Field label="Limit Price">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price ?? ""}
              disabled={isDisabled}
              onChange={(e) =>
                update(
                  "price",
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
              className="field"
            />
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stop Loss">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.stopLoss ?? ""}
              disabled={isDisabled}
              placeholder="Optional"
              onChange={(e) =>
                update(
                  "stopLoss",
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
              className="field"
            />
          </Field>

          <Field label="Take Profit">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.takeProfit ?? ""}
              disabled={isDisabled}
              placeholder="Optional"
              onChange={(e) =>
                update(
                  "takeProfit",
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
              className="field"
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div>
            <div className="text-xs font-medium text-slate-300">
              Reduce Only
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              Prevent this order from increasing the current position.
            </div>
          </div>

          <input
            type="checkbox"
            checked={form.reduceOnly}
            disabled={isDisabled}
            onChange={(e) =>
              update(
                "reduceOnly",
                e.target.checked
              )
            }
            className="h-4 w-4"
          />
        </label>

        <Button
          type="submit"
          disabled={
            isDisabled ||
            form.quantity <= 0
          }
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />

          {loading
            ? "Submitting..."
            : `Place ${form.side} Order`}
        </Button>

        <p className="text-center text-[10px] leading-4 text-slate-600">
          Orders should pass through the backend risk manager before execution.
        </p>
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

        .field:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </Card>
  );
}

function SideButton({
  side,
  active,
  disabled,
  onClick,
}: {
  side: OrderSide;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const isBuy = side === "BUY";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-medium transition ${
        active
          ? isBuy
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/40 bg-red-500/10 text-red-400"
          : "border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300"
      }`}
    >
      {isBuy ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}

      {side}
    </button>
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
