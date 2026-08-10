
"use client";

import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface Position {
  id: string;
  symbol: string;

  side: "LONG" | "SHORT";

  quantity: number;

  entryPrice: number;
  markPrice: number;

  unrealizedPnl: number;
  unrealizedPnlPercent: number;

  leverage?: number;
  liquidationPrice?: number;

  margin?: number;
}

interface PositionTableProps {
  positions: Position[];
  loading?: boolean;

  onClose?: (
    position: Position
  ) => void;
}

export default function PositionTable({
  positions,
  loading = false,
  onClose,
}: PositionTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 p-5">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Open Positions
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Current positions and unrealized performance.
          </p>
        </div>

        <span className="text-xs text-slate-600">
          {positions.length} open
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-left">
              <Header>Symbol</Header>
              <Header>Side</Header>
              <Header>Size</Header>
              <Header>Entry</Header>
              <Header>Mark</Header>
              <Header>Leverage</Header>
              <Header>Liquidation</Header>
              <Header>Unrealized PnL</Header>
              <Header>Action</Header>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <LoadingRows />
            ) : positions.length === 0 ? (
              <EmptyRow />
            ) : (
              positions.map(
                (position) => (
                  <PositionRow
                    key={position.id}
                    position={position}
                    onClose={onClose}
                  />
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PositionRow({
  position,
  onClose,
}: {
  position: Position;
  onClose?: (
    position: Position
  ) => void;
}) {
  const profitable =
    position.unrealizedPnl >= 0;

  return (
    <tr className="border-b border-slate-900 transition hover:bg-slate-950">
      <Cell>
        <span className="font-medium text-slate-200">
          {position.symbol}
        </span>
      </Cell>

      <Cell>
        <div className="flex items-center gap-2">
          {position.side === "LONG" ? (
            <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-red-400" />
          )}

          <Badge
            variant={
              position.side === "LONG"
                ? "success"
                : "danger"
            }
          >
            {position.side}
          </Badge>
        </div>
      </Cell>

      <Cell>
        {position.quantity.toFixed(5)}
      </Cell>

      <Cell>
        ${formatPrice(position.entryPrice)}
      </Cell>

      <Cell>
        ${formatPrice(position.markPrice)}
      </Cell>

      <Cell>
        {position.leverage
          ? `${position.leverage}x`
          : "--"}
      </Cell>

      <Cell>
        {position.liquidationPrice
          ? `$${formatPrice(
              position.liquidationPrice
            )}`
          : "--"}
      </Cell>

      <Cell>
        <div
          className={
            profitable
              ? "text-emerald-400"
              : "text-red-400"
          }
        >
          {profitable ? "+" : ""}
          ${position.unrealizedPnl.toFixed(2)}

          <span className="ml-1 text-[10px] opacity-70">
            ({profitable ? "+" : ""}
            {position.unrealizedPnlPercent.toFixed(
              2
            )}
            %)
          </span>
        </div>
      </Cell>

      <Cell>
        <button
          type="button"
          onClick={() =>
            onClose?.(position)
          }
          className="rounded-md border border-slate-800 px-3 py-1.5 text-[11px] text-slate-400 transition hover:border-red-500/40 hover:text-red-400"
        >
          Close
        </button>
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
    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
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
    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-400">
      {children}
    </td>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 4 }).map(
        (_, row) => (
          <tr key={row}>
            {Array.from({ length: 9 }).map(
              (_, column) => (
                <td
                  key={column}
                  className="px-4 py-4"
                >
                  <div className="h-3 animate-pulse rounded bg-slate-900" />
                </td>
              )
            )}
          </tr>
        )
      )}
    </>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td
        colSpan={9}
        className="py-12 text-center text-xs text-slate-600"
      >
        No open positions.
      </td>
    </tr>
  );
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