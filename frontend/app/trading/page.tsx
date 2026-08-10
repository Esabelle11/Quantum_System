
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  CircleDollarSign,
  ListOrdered,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import PortfolioSummary from "@/components/trading/PortfolioSummary";
import PositionTable from "@/components/trading/PositionTable";
import OrderTable from "@/components/trading/OrderTable";
import RiskPanel from "@/components/trading/RiskPanel";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useTrading } from "@/hooks/useTrading";

export default function TradingPage() {
  const {
    positions,
    orders,
    portfolio,
    risk,
    loading,
    error,
    refetch,
  } = useTrading();

  const positionItems = positions ?? [];
  const orderItems = orders ?? [];

  const openPositions = positionItems.filter(
    (position: {
      status?: string;
      size?: number;
    }) =>
      position.status === "OPEN" ||
      Number(position.size ?? 0) !== 0
  );

  const openOrders = orderItems.filter(
    (order: {
      status?: string;
    }) =>
      ["NEW", "OPEN", "PARTIALLY_FILLED"].includes(
        order.status ?? ""
      )
  );

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Execution
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Trading
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Monitor portfolio exposure, positions, orders, and
              execution risk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                error
                  ? "danger"
                  : loading
                  ? "default"
                  : "success"
              }
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />

              {error
                ? "Unavailable"
                : loading
                ? "Syncing"
                : "Execution Online"}
            </Badge>

            <button
              type="button"
              onClick={() => refetch?.()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs font-medium text-red-400">
              Trading data unavailable
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              {error}
            </div>
          </Card>
        )}

        {/* Portfolio */}
        <section className="mb-5">
          <PortfolioSummary
            portfolio={portfolio}
            loading={loading}
          />
        </section>

        {/* Quick stats */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Activity}
            label="Open Positions"
            value={String(openPositions.length)}
          />

          <MetricCard
            icon={ListOrdered}
            label="Open Orders"
            value={String(openOrders.length)}
          />

          <MetricCard
            icon={ShieldCheck}
            label="Risk Status"
            value={
              risk?.status ??
              "Monitoring"
            }
          />

          <MetricCard
            icon={Bot}
            label="Execution Mode"
            value={
              portfolio?.mode ??
              "Paper"
            }
          />
        </section>

        {/* Main grid */}
        <div className="grid gap-5 xl:grid-cols-3">
          <section className="space-y-5 xl:col-span-2">
            {/* Positions */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Open Positions
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Current exposure across the trading portfolio.
                  </p>
                </div>

                <Link
                  href="/trading/positions"
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <PositionTable
                positions={openPositions.slice(0, 5)}
                loading={loading}
                compact
              />
            </Card>

            {/* Orders */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Latest order activity from the execution engine.
                  </p>
                </div>

                <Link
                  href="/trading/orders"
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <OrderTable
                orders={orderItems.slice(0, 5)}
                loading={loading}
                compact
              />
            </Card>
          </section>

          {/* Risk */}
          <aside>
            <RiskPanel
              risk={risk}
              loading={loading}
            />
          </aside>
        </div>

        {/* Navigation */}
        <section className="mt-8">
          <div className="mb-3 text-[10px] uppercase tracking-wider text-slate-600">
            Trading Operations
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TradingLink
              href="/trading/positions"
              icon={TrendingUp}
              title="Positions"
              description="Inspect open exposure and unrealized PnL."
            />

            <TradingLink
              href="/trading/orders"
              icon={ListOrdered}
              title="Orders"
              description="Review pending, filled, and cancelled orders."
            />

            <TradingLink
              href="/strategy"
              icon={BarChart3}
              title="Strategies"
              description="Return to strategy configuration and validation."
            />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}

function MetricCard({
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

function TradingLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="group p-5 transition hover:border-slate-700">
        <div className="flex items-center justify-between">
          <Icon className="h-4 w-4 text-slate-600" />

          <ArrowRight className="h-3.5 w-3.5 text-slate-700 transition group-hover:text-slate-400" />
        </div>

        <div className="mt-4 text-xs font-medium text-slate-300 group-hover:text-white">
          {title}
        </div>

        <p className="mt-1 text-[10px] leading-5 text-slate-600">
          {description}
        </p>
      </Card>
    </Link>
  );
}