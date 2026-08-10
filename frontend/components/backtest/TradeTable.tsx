
"use client";

import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Trade {
  id: string | number;

  entryTime: string;
  exitTime: string;

  side: "LONG" | "SHORT";

  entryPrice: number;
  exitPrice: number;

  quantity: number;

  pnl: number;
  pnlPercent: number;

  fees?: number;

  strategy?: string;
}

interface TradeTableProps {
  trades: Trade[];
  loading?: boolean;
}

export default function TradeTable({
  trades,
  loading = false,
}: TradeTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-white">
          Executed Trades
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Individual trades generated during the backtest.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <Header>Side</Header>
              <Header>Entry</Header>
              <Header>Exit</Header>
              <Header>Entry Price</Header>
              <Header>Exit Price</Header>
              <Header>Quantity</Header>
              <Header>PnL</Header>
              <Header>Return</Header>
              <Header>Fees</Header>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <LoadingRows />
            ) : trades.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-sm text-slate-600"
                >
                  No trades found.
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TradeRow({
  trade,
}: {
  trade: Trade;
}) {
  const profitable =
    trade.pnl >= 0;

  return (
    <tr className="border-b border-slate-900 transition hover:bg-slate-950">
      <Cell>
        <div className="flex items-center gap-2">
          {trade.side === "LONG" ? (
            <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-red-400" />
          )}

          <Badge
            variant={
              trade.side === "LONG"
                ? "success"
                : "danger"
            }
          >
            {trade.side}
          </Badge>
        </div>
      </Cell>

      <Cell>
        {formatDate(trade.entryTime)}
      </Cell>

      <Cell>
        {formatDate(trade.exitTime)}
      </Cell>

      <Cell>
        ${trade.entryPrice.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}
      </Cell>

      <Cell>
        ${trade.exitPrice.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}
      </Cell>

      <Cell>
        {trade.quantity.toFixed(5)}
      </Cell>

      <Cell>
        <span
          className={
            profitable
              ? "font-medium text-emerald-400"
              : "font-medium text-red-400"
          }
        >
          {profitable ? "+" : ""}
          ${trade.pnl.toFixed(2)}
        </span>
      </Cell>

      <Cell>
        <span
          className={
            profitable
              ? "text-emerald-400"
              : "text-red-400"
          }
        >
          {profitable ? "+" : ""}
          {trade.pnlPercent.toFixed(2)}%
        </span>
      </Cell>

      <Cell>
        {trade.fees === undefined
          ? "--"
          : `$${trade.fees.toFixed(2)}`}
      </Cell>
    </tr>
  );
}

function Header({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-600">
      {children}
    </th>
  );
}

function Cell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
      {children}
    </td>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <tr key={index}>
            {Array.from({
              length: 9,
            }).map((_, cell) => (
              <td
                key={cell}
                className="px-4 py-4"
              >
                <div className="h-3 animate-pulse rounded bg-slate-900" />
              </td>
            ))}
          </tr>
        )
      )}
    </>
  );
}

function formatDate(
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}