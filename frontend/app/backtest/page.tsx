
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Clock3,
  FlaskConical,
  History,
  Play,
  RefreshCw,
  Settings2,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import BacktestForm from "@/components/backtest/BacktestForm";
import BacktestSummary from "@/components/backtest/BacktestSummary";
import PerformanceMetrics from "@/components/backtest/PerformanceMetrics";
import TradeTable from "@/components/backtest/TradeTable";

import EquityCurve from "@/components/charts/EquityCurve";
import DrawdownChart from "@/components/charts/DrawdownChart";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useBacktest } from "@/hooks/useBacktest";

export default function BacktestPage() {
  const {
    backtests,
    backtest,
    loading,
    error,
    refetch,
    runBacktest,
  } = useBacktest();

  const recentBacktests =
    backtests ?? [];

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Quant Research
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Backtesting
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Evaluate strategies against historical market data
              before deploying them to live execution.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch?.()}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
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
        <div className="mb-5 flex items-center gap-3">
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
              ? "Loading"
              : "Backtest Engine Ready"}
          </Badge>

          <span className="text-[10px] text-slate-600">
            Historical simulation
          </span>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-red-400">
                  Backtest data unavailable
                </div>

                <div className="mt-1 text-[11px] text-slate-600">
                  {error}
                </div>
              </div>

              <button
                type="button"
                onClick={() => refetch?.()}
                className="rounded-md border border-slate-800 px-3 py-1.5 text-[11px] text-slate-400 hover:text-white"
              >
                Retry
              </button>
            </div>
          </Card>
        )}

        {/* Main workspace */}
        <div className="grid gap-5 xl:grid-cols-3">
          {/* Configuration */}
          <section className="xl:col-span-1">
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-slate-500" />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Backtest Configuration
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Configure the historical simulation.
                  </p>
                </div>
              </div>

              <BacktestForm
                onSubmit={runBacktest}
                loading={loading}
              />
            </Card>
          </section>

          {/* Current result */}
          <section className="space-y-5 xl:col-span-2">
            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Latest Backtest
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Most recently executed simulation.
                  </p>
                </div>

                {backtest?.id && (
                  <Link
                    href={`/backtest/${backtest.id}`}
                    className="flex items-center gap-1 text-[11px] text-slate-500 transition hover:text-white"
                  >
                    Full result
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {backtest ? (
                <BacktestSummary
                  backtest={backtest}
                  loading={loading}
                />
              ) : (
                <EmptyBacktestState />
              )}
            </Card>

            {/* Metrics */}
            {backtest && (
              <PerformanceMetrics
                metrics={backtest.metrics}
                loading={loading}
              />
            )}
          </section>
        </div>

        {/* Charts */}
        {backtest && (
          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            <Card className="p-5">
              <div className="mb-5">
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

              <div className="h-[300px]">
                <EquityCurve
                  data={
                    backtest.equityCurve ??
                    []
                  }
                  loading={loading}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-slate-500" />

                  <h2 className="text-sm font-semibold text-white">
                    Drawdown
                  </h2>
                </div>

                <p className="mt-1 text-[11px] text-slate-600">
                  Portfolio drawdown over the backtest period.
                </p>
              </div>

              <div className="h-[300px]">
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

        {/* Trades */}
        {backtest && (
          <section className="mt-5">
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Trade History
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Trades generated during the simulation.
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

        {/* Previous runs */}
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-slate-500" />

            <div>
              <h2 className="text-sm font-semibold text-white">
                Previous Backtests
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Previously executed simulations.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden">
            {recentBacktests.length === 0 ? (
              <div className="p-8 text-center">
                <History className="mx-auto h-6 w-6 text-slate-700" />

                <p className="mt-3 text-xs text-slate-500">
                  No previous backtests.
                </p>

                <p className="mt-1 text-[10px] text-slate-700">
                  Run your first simulation using the configuration panel above.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-900">
                {recentBacktests.map(
                  (item: {
                    id: string;
                    strategyName?: string;
                    symbol?: string;
                    timeframe?: string;
                    createdAt?: string;
                    returnPct?: number;
                  }) => (
                    <Link
                      key={item.id}
                      href={`/backtest/${item.id}`}
                      className="flex flex-col gap-3 p-4 transition hover:bg-slate-950 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                          <BarChart3 className="h-4 w-4 text-slate-600" />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-300">
                            {item.strategyName ??
                              "Unnamed Strategy"}
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                            <span>
                              {item.symbol ??
                                "BTCUSDT"}
                            </span>

                            <span>•</span>

                            <span>
                              {item.timeframe ??
                                "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {item.createdAt && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                            <Calendar className="h-3 w-3" />

                            {formatDate(
                              item.createdAt
                            )}
                          </div>
                        )}

                        {typeof item.returnPct ===
                          "number" && (
                          <span
                            className={`text-xs font-medium ${
                              item.returnPct >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {formatPercent(
                              item.returnPct
                            )}
                          </span>
                        )}

                        <ArrowRight className="h-3 w-3 text-slate-700" />
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </Card>
        </section>
      </PageContainer>
    </AppShell>
  );
}

function EmptyBacktestState() {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
      <div className="rounded-full border border-slate-800 bg-slate-950 p-3">
        <Play className="h-5 w-5 text-slate-600" />
      </div>

      <h3 className="mt-4 text-xs font-medium text-slate-400">
        No backtest result
      </h3>

      <p className="mt-1 max-w-sm text-[10px] leading-5 text-slate-700">
        Configure your strategy and run a historical simulation
        to see performance results here.
      </p>
    </div>
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