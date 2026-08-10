
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Edit3,
  FlaskConical,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useParams } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import StrategyForm from "@/components/strategy/StrategyForm";
import SignalConfig from "@/components/strategy/SignalConfig";
import RegimeConfig from "@/components/strategy/RegimeConfig";
import StrategyStatus from "@/components/strategy/StrategyStatus";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { useStrategies } from "@/hooks/useStrategies";

export default function StrategyDetailPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const id = params?.id;

  const {
    strategy,
    loading,
    error,
    refetch,
    updateStrategy,
  } = useStrategies(id);

  const handleUpdate = async (
    values: Record<string, unknown>
  ) => {
    await updateStrategy?.(
      id,
      values
    );
  };

  return (
    <AppShell>
      <PageContainer>
        {/* Back */}
        <Link
          href="/strategy"
          className="mb-5 inline-flex items-center gap-2 text-[11px] text-slate-600 transition hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to strategies
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Strategy Detail
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
                  : strategy?.status ??
                    "Draft"}
              </Badge>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              {strategy?.name ??
                "Strategy"}
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              {strategy?.description ??
                "Strategy definition, signals, regime conditions, and validation state."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            {strategy && (
              <Link
                href={`/backtest?strategyId=${strategy.id}`}
              >
                <Button>
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                  Run Backtest
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs font-medium text-red-400">
              Unable to load strategy
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              {error}
            </div>
          </Card>
        )}

        {!strategy && !loading && !error && (
          <Card className="p-10 text-center">
            <BrainCircuit className="mx-auto h-7 w-7 text-slate-700" />

            <div className="mt-4 text-xs text-slate-500">
              Strategy not found.
            </div>

            <Link
              href="/strategy"
              className="mt-4 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              Return to strategies
              <ArrowLeft className="h-3 w-3" />
            </Link>
          </Card>
        )}

        {strategy && (
          <>
            {/* Metadata */}
            <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetaCard
                icon={BarChart3}
                label="Symbol"
                value={
                  strategy.symbol ??
                  "BTCUSDT"
                }
              />

              <MetaCard
                icon={TrendingUp}
                label="Timeframe"
                value={
                  strategy.timeframe ??
                  "Unknown"
                }
              />

              <MetaCard
                icon={Calendar}
                label="Created"
                value={
                  strategy.createdAt
                    ? formatDate(
                        strategy.createdAt
                      )
                    : "Unknown"
                }
              />

              <MetaCard
                icon={ShieldCheck}
                label="Status"
                value={
                  strategy.status ??
                  "DRAFT"
                }
              />
            </section>

            {/* Status */}
            <section className="mb-5">
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-500" />

                      <h2 className="text-sm font-semibold text-white">
                        Strategy Status
                      </h2>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-600">
                      Current readiness of this strategy.
                    </p>
                  </div>

                  <Edit3 className="h-4 w-4 text-slate-700" />
                </div>

                <StrategyStatus
                  status={
                    strategy.status ??
                    "DRAFT"
                  }
                  loading={loading}
                />
              </Card>
            </section>

            {/* Strategy definition */}
            <section className="mb-5">
              <Card className="p-5">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Strategy Definition
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Core strategy configuration.
                  </p>
                </div>

                <StrategyForm
                  initialValues={strategy}
                  onSubmit={handleUpdate}
                  loading={loading}
                  mode="edit"
                />
              </Card>
            </section>

            {/* Signals */}
            <section className="mb-5">
              <Card className="p-5">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Signal Configuration
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Entry, exit, and signal generation rules.
                  </p>
                </div>

                <SignalConfig
                  value={
                    strategy.signalConfig
                  }
                  readOnly
                />
              </Card>
            </section>

            {/* Regime */}
            <section className="mb-5">
              <Card className="p-5">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Regime Configuration
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Market states where the strategy is allowed to operate.
                  </p>
                </div>

                <RegimeConfig
                  value={
                    strategy.regimeConfig
                  }
                  readOnly
                />
              </Card>
            </section>

            {/* Validation pipeline */}
            <section className="mb-5">
              <Card className="p-5">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-slate-500" />

                    <h2 className="text-sm font-semibold text-white">
                      Validation Pipeline
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Strategy progression from definition to deployment.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <ValidationStep
                    title="Defined"
                    description="Strategy configuration"
                    active
                  />

                  <ValidationStep
                    title="Research"
                    description="Hypothesis support"
                    active={
                      Boolean(
                        strategy.researchId
                      )
                    }
                  />

                  <ValidationStep
                    title="Backtested"
                    description="Historical validation"
                    active={
                      Boolean(
                        strategy.lastBacktestId
                      )
                    }
                  />

                  <ValidationStep
                    title="Deployable"
                    description="Execution ready"
                    active={
                      strategy.status ===
                      "ACTIVE"
                    }
                  />
                </div>
              </Card>
            </section>

            {/* Related links */}
            <section className="grid gap-4 md:grid-cols-2">
              {strategy.researchId && (
                <Link
                  href={`/research/${strategy.researchId}`}
                >
                  <Card className="group p-5 transition hover:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-slate-600" />

                        <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                          Research
                        </span>
                      </div>

                      <ArrowRight className="h-3.5 w-3.5 text-slate-700 group-hover:text-slate-400" />
                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-slate-600">
                      View the research supporting this strategy.
                    </p>
                  </Card>
                </Link>
              )}

              {strategy.lastBacktestId && (
                <Link
                  href={`/backtest/${strategy.lastBacktestId}`}
                >
                  <Card className="group p-5 transition hover:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-slate-600" />

                        <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                          Latest Backtest
                        </span>
                      </div>

                      <ArrowRight className="h-3.5 w-3.5 text-slate-700 group-hover:text-slate-400" />
                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-slate-600">
                      Inspect the latest historical performance.
                    </p>
                  </Card>
                </Link>
              )}
            </section>
          </>
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

function ValidationStep({
  title,
  description,
  active = false,
}: {
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        active
          ? "border-slate-800 bg-slate-950"
          : "border-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active
              ? "bg-emerald-400"
              : "bg-slate-800"
          }`}
        />

        <span
          className={`text-xs ${
            active
              ? "text-slate-300"
              : "text-slate-700"
          }`}
        >
          {title}
        </span>
      </div>

      <p className="mt-2 text-[10px] text-slate-600">
        {description}
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
