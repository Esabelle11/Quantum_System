
// frontend/components/market/OrderBook.tsx

"use client";

import { cn } from "@/lib/utils";

interface OrderBookLevel {
  price: number;
  quantity: number;
  total?: number;
}

interface OrderBookProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];

  spread?: number | null;

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

export default function OrderBook({
  bids,
  asks,
  spread,
  maxRows = 8,
  loading = false,
}: OrderBookProps) {
  const visibleBids =
    bids.slice(0, maxRows);

  const visibleAsks =
    asks
      .slice(0, maxRows)
      .reverse();

  const maxTotal = Math.max(
    ...bids.map(
      (level) =>
        level.total ??
        level.quantity
    ),
    ...asks.map(
      (level) =>
        level.total ??
        level.quantity
    ),
    1
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
        <div className="animate-pulse space-y-3">
          {Array.from({
            length: 10,
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
          <h3 className="text-sm font-medium text-slate-200">
            Order Book
          </h3>

          {spread !== null &&
            spread !== undefined && (
              <span className="text-xs text-slate-500">
                Spread:{" "}
                {spread.toFixed(2)}
              </span>
            )}
        </div>
      </div>

      <div className="px-3 py-2">
        <OrderHeader />

        <div className="mt-1 space-y-0.5">
          {visibleAsks.map(
            (level, index) => (
              <OrderRow
                key={`ask-${level.price}-${index}`}
                level={level}
                side="ask"
                maxTotal={maxTotal}
              />
            )
          )}
        </div>

        <div className="my-2 flex items-center justify-center border-y border-slate-800 py-2">
          <span className="text-xs font-medium text-slate-500">
            Spread
          </span>

          <span className="mx-2 text-xs text-slate-700">
            •
          </span>

          <span className="text-xs font-medium text-slate-300">
            {spread === null ||
            spread === undefined
              ? "--"
              : spread.toFixed(2)}
          </span>
        </div>

        <div className="space-y-0.5">
          {visibleBids.map(
            (level, index) => (
              <OrderRow
                key={`bid-${level.price}-${index}`}
                level={level}
                side="bid"
                maxTotal={maxTotal}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function OrderHeader() {
  return (
    <div className="grid grid-cols-3 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-600">
      <span>Price</span>

      <span className="text-right">
        Amount
      </span>

      <span className="text-right">
        Total
      </span>
    </div>
  );
}

interface OrderRowProps {
  level: OrderBookLevel;
  side: "bid" | "ask";
  maxTotal: number;
}

function OrderRow({
  level,
  side,
  maxTotal,
}: OrderRowProps) {
  const total =
    level.total ??
    level.quantity;

  const width =
    Math.min(
      (total / maxTotal) * 100,
      100
    );

  return (
    <div className="relative grid grid-cols-3 items-center px-2 py-1 text-xs">
      <div
        className={cn(
          "absolute inset-y-0 right-0 opacity-10",
          side === "bid"
            ? "bg-emerald-500"
            : "bg-red-500"
        )}
        style={{
          width: `${width}%`,
        }}
      />

      <span
        className={cn(
          "relative font-medium",
          side === "bid"
            ? "text-emerald-400"
            : "text-red-400"
        )}
      >
        {formatPrice(
          level.price
        )}
      </span>

      <span className="relative text-right text-slate-300">
        {formatQuantity(
          level.quantity
        )}
      </span>

      <span className="relative text-right text-slate-500">
        {formatQuantity(total)}
      </span>
    </div>
  );
}

