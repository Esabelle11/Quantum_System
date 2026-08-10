
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import PositionTable from "@/components/trading/PositionTable";
import PortfolioSummary from "@/components/trading/PortfolioSummary";
import RiskPanel from "@/components/trading/RiskPanel";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useTrading } from "@/hooks/useTrading";

export default function PositionsPage() {
  const {
    positions,
    portfolio,
    risk,
    loading,
    error,
    refetch,
  } = useTrading();

  const items = positions ?? [];

  const openPositions = items.filter(
    (position: {
      status?: string;
      size?: number;
    }) =>
      position.status === "OPEN" ||
      Number(position.size ?? 0) !== 0
  );

  const longPositions = openPositions.filter(
    (position: {
      side?: string;
    }) =>
      String(position.side ?? "").toUpperCase() ===
      "LONG"
  );

  const shortPositions = openPositions.filter(
    (position: {
      side?: string;
    }) =>
      String(position.side ?? "").toUpperCase() ===
      "SHORT"
  );

  const totalUnrealizedPnl = openPositions.reduce(
    (
      total: number,
      position: {
        unrealizedPnl?: number;
        pnl?: number;
      }
    ) =>
      total +
      Number(
        position.unrealizedPnl ??
          position.pnl ??
          0
      ),
    0
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
              <BarChart3 className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Execution
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Positions
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor open positions, exposure, and unrealized PnL.
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
              : `${openPositions.length} Open Position${
                  openPositions.length === 1
                    ? ""
                    : "s"
                }`}
          </Badge>
        </div>

        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs text-red-400">
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

        {/* Position statistics */}
        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PositionMetric
            icon={BarChart3}
            label="Open Positions"
            value={String(openPositions.length)}
          />

          <PositionMetric
            icon={TrendingUp}
            label="Long"
            value={String(longPositions.length)}
          />

          <PositionMetric
            icon={TrendingDown}
            label="Short"
            value={String(shortPositions.length)}
          />

          <PositionMetric
            icon={ShieldCheck}
            label="Unrealized PnL"
            value={formatNumber(
              totalUnrealizedPnl
            )}
            positive={
              totalUnrealizedPnl > 0
            }
            negative={
              totalUnrealizedPnl < 0
            }
          />
        </section>

        {/* Table + risk */}
        <div className="grid gap-5 xl:grid-cols-4">
          <Card className="overflow-hidden xl:col-span-3">
            <div className="border-b border-slate-900 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Open Positions
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Current position-level exposure.
              </p>
            </div>

            <PositionTable
              positions={openPositions}
              loading={loading}
            />
          </Card>

          <RiskPanel
            risk={risk}
            loading={loading}
          />
        </div>
      </PageContainer>
    </AppShell>
  );
}

function PositionMetric({
  icon: Icon,
  label,
  value,
  positive,
  negative,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <Card className="p-4">
      <Icon className="h-4 w-4 text-slate-600" />

      <div className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div
        className={`mt-1 text-sm font-semibold ${
          positive
            ? "text-emerald-400"
            : negative
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </div>
    </Card>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}