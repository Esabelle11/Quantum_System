
// frontend/components/market/TradeFlow.tsx

"use client";

import {
  ArrowDown,
  ArrowUp,
  Activity,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface Trade {
  id: string;

  timestamp: number;

  price: number;

  quantity: number;

  side: "buy" | "sell";
}

interface TradeFlowProps {
  trades: Trade[];

  maxRows?: number;

  loading?: boolean;
}

function formatPrice(
  value: number
) {
  return value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

function formatQuantity(
  value: number
) {
  return value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }
  );
}

function formatTime(
  timestamp: number
) {
  return new Date(
    timestamp
  ).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
}

export default function TradeFlow({
  trades,
  maxRows = 15,
  loading = false,
}: TradeFlowProps) {
  const visibleTrades =
    trades.slice(0, maxRows);

  const buyVolume =
    trades
      .filter(
        (trade) =>
          trade.side === "buy"
      )
      .reduce(
        (sum, trade) =>
          sum + trade.quantity,
        0
      );

  const sellVolume =
    trades
      .filter(
        (trade) =>
          trade.side === "sell"
      )
      .reduce(
        (sum, trade) =>
          sum + trade.quantity,
        0
      );

  const totalVolume =
    buyVolume + sellVolume;

  const buyPercentage =
    totalVolume > 0
      ? (buyVolume /
          totalVolume) *
        100
      : 50;

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
        <div className="animate-pulse space-y-3">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="h-5 rounded bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />

            <h3 className="text-sm font-medium text-slate-200">
              Trade Flow
            </h3>
          </div>

          <span className="text-xs text-slate-500">
            Recent Trades
          </span>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-emerald-400">
              Buy{" "}
              {buyPercentage.toFixed(
                1
              )}
              %
            </span>

            <span className="text-red-400">
              Sell{" "}
              {(100 -
                buyPercentage).toFixed(
                1
              )}
              %
            </span>
          </div>

          <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="bg-emerald-500"
              style={{
                width: `${buyPercentage}%`,
              }}
            />

            <div
              className="bg-red-500"
              style={{
                width: `${
                  100 -
                  buyPercentage
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <TradeHeader />

        <div className="divide-y divide-slate-900">
          {visibleTrades.length ===
          0 ? (
            <div className="py-8 text-center text-xs text-slate-600">
              No recent trades
            </div>
          ) : (
            visibleTrades.map(
              (trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}

function TradeHeader() {
  return (
    <div className="grid grid-cols-4 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-600">
      <span>Time</span>

      <span>Side</span>

      <span className="text-right">
        Price
      </span>

      <span className="text-right">
        Amount
      </span>
    </div>
  );
}

interface TradeRowProps {
  trade: Trade;
}

function TradeRow({
  trade,
}: TradeRowProps) {
  const isBuy =
    trade.side === "buy";

  return (
    <div className="grid grid-cols-4 items-center px-2 py-1.5 text-xs">
      <span className="text-slate-500">
        {formatTime(
          trade.timestamp
        )}
      </span>

      <span
        className={cn(
          "flex items-center gap-1 font-medium",
          isBuy
            ? "text-emerald-400"
            : "text-red-400"
        )}
      >
        {isBuy ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}

        {isBuy
          ? "Buy"
          : "Sell"}
      </span>

      <span className="text-right font-medium text-slate-300">
        {formatPrice(
          trade.price
        )}
      </span>

      <span className="text-right text-slate-500">
        {formatQuantity(
          trade.quantity
        )}
      </span>
    </div>
  );
}

