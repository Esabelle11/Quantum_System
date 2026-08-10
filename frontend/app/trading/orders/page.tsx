
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  ListOrdered,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import OrderTable from "@/components/trading/OrderTable";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useTrading } from "@/hooks/useTrading";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    refetch,
  } = useTrading();

  const items = orders ?? [];

  const openOrders = items.filter(
    (order: {
      status?: string;
    }) =>
      ["NEW", "OPEN", "PARTIALLY_FILLED"].includes(
        order.status ?? ""
      )
  );

  const filledOrders = items.filter(
    (order: {
      status?: string;
    }) =>
      order.status === "FILLED"
  );

  const cancelledOrders = items.filter(
    (order: {
      status?: string;
    }) =>
      ["CANCELLED", "REJECTED", "EXPIRED"].includes(
        order.status ?? ""
      )
  );

  return (
    <AppShell>
      <PageContainer>
        <Link
          href="/trading"
          className="mb-5 inline-flex items-center gap-2 text-[11px] text-slate-600 hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to trading
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Execution
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Orders
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor active orders and execution history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch?.()}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 hover:border-slate-700 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* Status */}
        <div className="mb-5">
          <Badge
            variant={
              error
                ? "danger"
                : loading
                ? "default"
                : "success"
            }
          >
            {error
              ? "Unavailable"
              : loading
              ? "Syncing"
              : "Order Engine Connected"}
          </Badge>
        </div>

        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs text-red-400">
              {error}
            </div>
          </Card>
        )}

        {/* Statistics */}
        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OrderMetric
            icon={Clock3}
            label="Open"
            value={String(openOrders.length)}
          />

          <OrderMetric
            icon={CheckCircle2}
            label="Filled"
            value={String(filledOrders.length)}
          />

          <OrderMetric
            icon={XCircle}
            label="Cancelled / Rejected"
            value={String(
              cancelledOrders.length
            )}
          />

          <OrderMetric
            icon={ListOrdered}
            label="Total"
            value={String(items.length)}
          />
        </section>

        {/* Open orders */}
        <section className="mb-5">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Active Orders
                </h2>

                <p className="mt-1 text-[10px] text-slate-600">
                  Orders currently waiting for execution.
                </p>
              </div>

              <Badge variant="default">
                {openOrders.length} active
              </Badge>
            </div>

            <OrderTable
              orders={openOrders}
              loading={loading}
            />
          </Card>
        </section>

        {/* History */}
        <section>
          <Card className="overflow-hidden">
            <div className="border-b border-slate-900 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Order History
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Filled, cancelled, rejected, and expired orders.
              </p>
            </div>

            <OrderTable
              orders={items.filter(
                (order: {
                  status?: string;
                }) =>
                  ![
                    "NEW",
                    "OPEN",
                    "PARTIALLY_FILLED",
                  ].includes(
                    order.status ?? ""
                  )
              )}
              loading={loading}
            />
          </Card>
        </section>
      </PageContainer>
    </AppShell>
  );
}

function OrderMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <Icon className="h-4 w-4 text-slate-600" />

      <div className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-white">
        {value}
      </div>
    </Card>
  );
}
