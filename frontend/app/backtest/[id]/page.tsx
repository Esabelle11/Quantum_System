
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  History,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useParams } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import BacktestSummary from "@/components/backtest/BacktestSummary";
import PerformanceMetrics from "@/components/backtest/PerformanceMetrics";
import TradeTable from "@/components/backtest/TradeTable";

import EquityCurve from "@/components/charts/EquityCurve";
import DrawdownChart from "@/components/charts/DrawdownChart";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useBacktest } from "@/hooks/useBacktest";

export default function BacktestDetailPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const id = params?.id;

  const {
    backtest,
    loading,
    error,
    refetch,
  } = useBacktest(id);

  const metrics =
    backtest?.metrics ?? null;

  return (
    <AppShell>
      <PageContainer>
        {/* Back */}
        <Link
          href="/backtest"
          className="mb-5 inline-flex items-center gap-2 text-[11px] text-slate-600 transition hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to backtests
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Backtest Result
              </span>

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
                  ? "Error"
                  : loading
                  ? "Loading"
                  : "Completed"}
              </Badge>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              {backtest?.strategyName ??
                "Backtest Result"}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              {backtest?.symbol ??
                "BTCUSDT"}{" "}
              ·{" "}
              {backtest?.timeframe ??
                "Unknown timeframe"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch?.()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs font-medium text-red-400">
              Unable to load backtest
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              {error}
            </div>
          </Card>
        )}

        {/* Metadata */}
        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaCard
            icon={BarChart3}
            label="Symbol"
            value={
              backtest?.symbol ??
              "BTCUSDT"
            }
          />

          <MetaCard
            icon={Clock3}
            label="Timeframe"
            value={
              backtest?.timeframe ??
              "Unknown"
            }
          />

          <MetaCard
            icon={Calendar}
            label="Period"
            value={
              backtest?.startDate &&
              backtest?.endDate
                ? `${formatDate(
                    backtest.startDate
                  )} → ${formatDate(
                    backtest.endDate
                  )}`
                : "Unknown"
            }
          />

          <MetaCard
            icon={CheckCircle2}
            label="Status"
            value={
              backtest?.status ??
              "Completed"
            }
          />
        </section>

        {/* Summary */}
        {backtest && (
          <section className="mb-5">
            <BacktestSummary
              backtest={backtest}
              loading={loading}
            />
          </section>
        )}

        {/* Metrics */}
        {metrics && (
          <section className="mb-5">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Performance Metrics
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Statistical performance of the strategy.
                </p>
              </div>
            </div>

            <PerformanceMetrics
              metrics={metrics}
              loading={loading}
            />
          </section>
        )}

        {/* Main performance charts */}
        {backtest && (
          <section className="mb-5 grid gap-5 xl:grid-cols-2">
            {/* Equity */}
            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Equity Curve
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Portfolio value throughout the simulation.
                  </p>
                </div>

                {metrics?.totalReturn !==
                  undefined && (
                  <span
                    className={`text-xs font-medium ${
                      metrics.totalReturn >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatPercent(
                      metrics.totalReturn
                    )}
                  </span>
                )}
              </div>

              <div className="h-[360px]">
                <EquityCurve
                  data={
                    backtest.equityCurve ??
                    []
                  }
                  loading={loading}
                />
              </div>
            </Card>

            {/* Drawdown */}
            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Drawdown
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Peak-to-trough portfolio decline.
                  </p>
                </div>

                {metrics?.maxDrawdown !==
                  undefined && (
                  <span className="text-xs font-medium text-red-400">
                    {formatPercent(
                      metrics.maxDrawdown
                    )}
                  </span>
                )}
              </div>

              <div className="h-[360px]">
                <DrawdownChart
                  data={
                    backtest.drawdown ??
                    []
                  }
                  loading={loading}
                />
              </div>
            </Card>
          </section>
        )}

        {/* Additional performance information */}
        {backtest && (
          <section className="mb-5 grid gap-5 lg:grid-cols-3">
            <StatCard
              label="Initial Capital"
              value={
                metrics?.initialCapital !==
                undefined
                  ? formatMoney(
                      metrics.initialCapital
                    )
                  : "—"
              }
            />

            <StatCard
              label="Final Equity"
              value={
                metrics?.finalEquity !==
                undefined
                  ? formatMoney(
                      metrics.finalEquity
                    )
                  : "—"
              }
            />

            <StatCard
              label="Total Trades"
              value={
                metrics?.totalTrades !==
                undefined
                  ? String(
                      metrics.totalTrades
                    )
                  : String(
                      backtest.trades
                        ?.length ?? 0
                    )
              }
            />
          </section>
        )}

        {/* Trade history */}
        {backtest && (
          <section>
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Trade History
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Every executed trade generated by this backtest.
                  </p>
                </div>
              </div>

              <TradeTable
                trades={
                  backtest.trades ??
                  []
                }
                loading={loading}
              />
            </Card>
          </section>
        )}

        {/* Empty */}
        {!backtest &&
          !loading &&
          !error && (
            <Card className="p-10 text-center">
              <BarChart3 className="mx-auto h-7 w-7 text-slate-700" />

              <div className="mt-4 text-xs text-slate-500">
                Backtest not found.
              </div>

              <Link
                href="/backtest"
                className="mt-4 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                Return to backtests
                <ArrowLeft className="h-3 w-3" />
              </Link>
            </Card>
          )}
      </PageContainer>
    </AppShell>
  );
}

function MetaCard({
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
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-slate-600" />

        <span className="text-[10px] uppercase tracking-wider text-slate-600">
          {label}
        </span>
      </div>

      <div className="mt-2 text-xs font-medium text-slate-300">
        {value}
      </div>
    </Card>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-white">
        {value}
      </div>
    </Card>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatPercent(value: number) {
  const prefix = value >= 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}