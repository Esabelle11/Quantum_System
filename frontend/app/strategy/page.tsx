
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import StrategyCard from "@/components/strategy/StrategyCard";
import StrategyStatus from "@/components/strategy/StrategyStatus";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { useStrategies } from "@/hooks/useStrategies";

export default function StrategyPage() {
  const {
    strategies,
    loading,
    error,
    refetch,
  } = useStrategies();

  const items = strategies ?? [];

  const activeCount = items.filter(
    (strategy: {
      status?: string;
      isActive?: boolean;
    }) =>
      strategy.isActive ||
      strategy.status === "ACTIVE"
  ).length;

  const draftCount = items.filter(
    (strategy: {
      status?: string;
    }) =>
      strategy.status === "DRAFT"
  ).length;

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Quant Strategy
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Strategies
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Define systematic trading strategies using signals,
              market regimes, and risk constraints.
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

            <Link href="/strategy/new">
              <Button>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Strategy
              </Button>
            </Link>
          </div>
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
              : "Strategy Engine Ready"}
          </Badge>

          <span className="text-[10px] text-slate-600">
            Signal + regime driven
          </span>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-red-400">
                  Strategy data unavailable
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

        {/* Overview */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            icon={BrainCircuit}
            label="Total Strategies"
            value={String(items.length)}
          />

          <OverviewCard
            icon={CheckCircle2}
            label="Active"
            value={String(activeCount)}
          />

          <OverviewCard
            icon={Clock3}
            label="Drafts"
            value={String(draftCount)}
          />

          <OverviewCard
            icon={ShieldCheck}
            label="Execution"
            value={
              activeCount > 0
                ? "Configured"
                : "Not Ready"
            }
          />
        </section>

        {/* Strategy list */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Strategy Library
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Strategies available for research and backtesting.
              </p>
            </div>

            <span className="text-[10px] text-slate-700">
              {items.length} total
            </span>
          </div>

          {items.length === 0 ? (
            <EmptyStrategyState />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map(
                (
                  strategy: {
                    id: string;
                    name?: string;
                    description?: string;
                    symbol?: string;
                    timeframe?: string;
                    status?: string;
                    isActive?: boolean;
                    signalCount?: number;
                    createdAt?: string;
                  }
                ) => (
                  <StrategyCard
                    key={strategy.id}
                    strategy={strategy}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* Workflow */}
        <section className="mt-8">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">
              Strategy Workflow
            </h2>

            <p className="mt-1 text-[11px] text-slate-600">
              How a strategy moves through your quant system.
            </p>
          </div>

          <Card className="p-5">
            <div className="grid gap-3 md:grid-cols-4">
              <WorkflowStep
                number="01"
                icon={FlaskConical}
                title="Research"
                description="Study market features and identify hypotheses."
              />

              <WorkflowStep
                number="02"
                icon={BrainCircuit}
                title="Strategy"
                description="Define signals and market regime conditions."
              />

              <WorkflowStep
                number="03"
                icon={TrendingUp}
                title="Backtest"
                description="Evaluate strategy performance historically."
              />

              <WorkflowStep
                number="04"
                icon={ShieldCheck}
                title="Execution"
                description="Apply risk management before live trading."
              />
            </div>
          </Card>
        </section>
      </PageContainer>
    </AppShell>
  );
}

function OverviewCard({
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

      <div className="mt-1 text-lg font-semibold text-white">
        {value}
      </div>
    </Card>
  );
}

function EmptyStrategyState() {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto w-fit rounded-full border border-slate-800 bg-slate-950 p-3">
        <BrainCircuit className="h-5 w-5 text-slate-600" />
      </div>

      <h3 className="mt-4 text-xs font-medium text-slate-400">
        No strategies yet
      </h3>

      <p className="mx-auto mt-1 max-w-md text-[10px] leading-5 text-slate-700">
        Create your first systematic strategy by combining
        quantitative signals and market regime conditions.
      </p>

      <Link
        href="/strategy/new"
        className="mt-5 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
      >
        Create strategy
        <ArrowRight className="h-3 w-3" />
      </Link>
    </Card>
  );
}

function WorkflowStep({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-slate-600" />

        <span className="text-[9px] tracking-wider text-slate-700">
          {number}
        </span>
      </div>

      <div className="mt-4 text-xs font-medium text-slate-300">
        {title}
      </div>

      <p className="mt-1 text-[10px] leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}