
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  FlaskConical,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import StrategyForm from "@/components/strategy/StrategyForm";
import SignalConfig from "@/components/strategy/SignalConfig";
import RegimeConfig from "@/components/strategy/RegimeConfig";
import StrategyStatus from "@/components/strategy/StrategyStatus";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useStrategies } from "@/hooks/useStrategies";

export default function NewStrategyPage() {
  const {
    loading,
    error,
    createStrategy,
  } = useStrategies();

  const handleSubmit = async (
    values: Record<string, unknown>
  ) => {
    await createStrategy?.(values);
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
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-slate-500" />

            <span className="text-[10px] uppercase tracking-widest text-slate-600">
              Strategy Builder
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            New Strategy
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Define the market universe, signals, regime conditions,
            and strategy metadata.
          </p>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs font-medium text-red-400">
              Unable to create strategy
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              {error}
            </div>
          </Card>
        )}

        {/* Main builder */}
        <div className="grid gap-5 xl:grid-cols-3">
          {/* Main configuration */}
          <main className="space-y-5 xl:col-span-2">
            {/* Basic information */}
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-500" />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Strategy Definition
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Basic strategy information and market universe.
                  </p>
                </div>
              </div>

              <StrategyForm
                onSubmit={handleSubmit}
                loading={loading}
                mode="create"
              />
            </Card>

            {/* Signals */}
            <Card className="p-5">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-500" />

                  <h2 className="text-sm font-semibold text-white">
                    Signal Configuration
                  </h2>
                </div>

                <p className="mt-1 text-[11px] text-slate-600">
                  Define the quantitative conditions used to generate
                  strategy signals.
                </p>
              </div>

              <SignalConfig />
            </Card>

            {/* Regime */}
            <Card className="p-5">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-slate-500" />

                  <h2 className="text-sm font-semibold text-white">
                    Regime Configuration
                  </h2>
                </div>

                <p className="mt-1 text-[11px] text-slate-600">
                  Define which market regimes allow the strategy to operate.
                </p>
              </div>

              <RegimeConfig />
            </Card>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5">
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Strategy Status
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Validation and readiness.
                  </p>
                </div>
              </div>

              <StrategyStatus
                status="DRAFT"
                loading={loading}
              />
            </Card>

            {/* Pipeline */}
            <Card className="p-5">
              <div className="mb-4 text-[10px] uppercase tracking-wider text-slate-600">
                Strategy Pipeline
              </div>

              <div className="space-y-3">
                <PipelineItem
                  number="01"
                  title="Define strategy"
                  description="Basic metadata"
                  active
                />

                <PipelineItem
                  number="02"
                  title="Configure signals"
                  description="Entry and exit conditions"
                  active
                />

                <PipelineItem
                  number="03"
                  title="Configure regime"
                  description="Market state filters"
                  active
                />

                <PipelineItem
                  number="04"
                  title="Backtest"
                  description="Historical validation"
                />

                <PipelineItem
                  number="05"
                  title="Deploy"
                  description="Live execution"
                />
              </div>
            </Card>

            {/* Warning */}
            <Card className="border-amber-500/10 p-5">
              <div className="flex items-start gap-3">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />

                <div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Research first
                  </div>

                  <p className="mt-1 text-[10px] leading-5 text-slate-700">
                    A strategy should ideally be supported by research
                    and historical evidence before being deployed.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              /*
               * StrategyForm owns its own form state.
               *
               * Keep the actual submit action inside StrategyForm
               * unless your form exposes a submit handler/ref.
               */
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-800 px-4 py-2.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />

            {loading
              ? "Saving..."
              : "Save Strategy"}
          </button>
        </div>

        <div className="mt-3 text-right text-[10px] text-slate-700">
          New strategies are created as drafts.
        </div>
      </PageContainer>
    </AppShell>
  );
}

function PipelineItem({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] ${
          active
            ? "border-slate-700 bg-slate-900 text-slate-300"
            : "border-slate-900 text-slate-700"
        }`}
      >
        {number}
      </div>

      <div>
        <div
          className={`text-[11px] ${
            active
              ? "text-slate-300"
              : "text-slate-600"
          }`}
        >
          {title}
        </div>

        <div className="mt-0.5 text-[9px] text-slate-700">
          {description}
        </div>
      </div>
    </div>
  );
}