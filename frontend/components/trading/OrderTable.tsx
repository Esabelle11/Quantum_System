
"use client";

import {
  ArrowDown,
  ArrowUp,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export type OrderStatus =
  | "NEW"
  | "OPEN"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELLED"
  | "REJECTED";

export interface Order {
  id: string;
  symbol: string;

  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT";

  quantity: number;
  filledQuantity: number;

  price?: number;
  averagePrice?: number;

  status: OrderStatus;

  createdAt: string;
  updatedAt?: string;
}

interface OrderTableProps {
  orders: Order[];

  loading?: boolean;

  onCancel?: (
    order: Order
  ) => void;
}

export default function OrderTable({
  orders,
  loading = false,
  onCancel,
}: OrderTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-white">
          Orders
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Order history and currently active orders.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-left">
              <Header>Order</Header>
              <Header>Symbol</Header>
              <Header>Side</Header>
              <Header>Type</Header>
              <Header>Quantity</Header>
              <Header>Filled</Header>
              <Header>Price</Header>
              <Header>Status</Header>
              <Header>Time</Header>
              <Header />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <LoadingRows />
            ) : orders.length === 0 ? (
              <EmptyRow />
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onCancel={onCancel}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OrderRow({
  order,
  onCancel,
}: {
  order: Order;
  onCancel?: (
    order: Order
  ) => void;
}) {
  const cancellable =
    order.status === "NEW" ||
    order.status === "OPEN" ||
    order.status ===
      "PARTIALLY_FILLED";

  return (
    <tr className="border-b border-slate-900 transition hover:bg-slate-950">
      <Cell>
        <span className="font-mono text-[11px] text-slate-500">
          {order.id}
        </span>
      </Cell>

      <Cell>
        <span className="font-medium text-slate-200">
          {order.symbol}
        </span>
      </Cell>

      <Cell>
        <div className="flex items-center gap-2">
          {order.side === "BUY" ? (
            <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-red-400" />
          )}

          <span
            className={
              order.side === "BUY"
                ? "text-emerald-400"
                : "text-red-400"
            }
          >
            {order.side}
          </span>
        </div>
      </Cell>

      <Cell>{order.type}</Cell>

      <Cell>
        {order.quantity.toFixed(5)}
      </Cell>

      <Cell>
        {order.filledQuantity.toFixed(5)}
      </Cell>

      <Cell>
        {order.averagePrice
          ? `$${formatPrice(
              order.averagePrice
            )}`
          : order.price
          ? `$${formatPrice(
              order.price
            )}`
          : "Market"}
      </Cell>

      <Cell>
        <OrderStatusBadge
          status={order.status}
        />
      </Cell>

      <Cell>
        {formatDate(order.createdAt)}
      </Cell>

      <Cell>
        {cancellable && (
          <button
            type="button"
            onClick={() =>
              onCancel?.(order)
            }
            className="rounded-md border border-slate-800 p-1.5 text-slate-500 transition hover:border-red-500/40 hover:text-red-400"
            title="Cancel order"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </Cell>
    </tr>
  );
}

function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const variant =
    status === "FILLED"
      ? "success"
      : status === "REJECTED"
      ? "danger"
      : status === "CANCELLED"
      ? "default"
      : status === "PARTIALLY_FILLED"
      ? "warning"
      : "default";

  return (
    <Badge variant={variant}>
      {status.replace("_", " ")}
    </Badge>
  );
}

function Header({
  children,
}: {
  children?: React.ReactNode;
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
      {Array.from({ length: 5 }).map(
        (_, row) => (
          <tr key={row}>
            {Array.from({ length: 10 }).map(
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
        colSpan={10}
        className="py-12 text-center text-xs text-slate-600"
      >
        No orders found.
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