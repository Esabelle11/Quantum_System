
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  FlaskConical,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import FeatureSelector from "@/components/research/FeatureSelector";
import FeaturePanel from "@/components/research/FeaturePanel";
import SignalPanel from "@/components/research/SignalPanel";
import RegimePanel from "@/components/research/RegimePanel";
import HypothesisPanel from "@/components/research/HypothesisPanel";
import EvidencePanel from "@/components/research/EvidencePanel";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { useResearch } from "@/hooks/useResearch";

export default function ResearchPage() {
  const {
    research,
    loading,
    error,
    refetch,
  } = useResearch();

  /*
   * Keep the page as a composition layer.
   *
   * Your useResearch hook should be responsible for:
   * - fetching research data
   * - loading state
   * - error state
   * - refreshing
   *
   * If your current hook uses different property names,
   * only adjust this destructuring section.
   */

  const studies = research?.studies ?? [];

  const activeStudy =
    research?.activeStudy ?? null;

  const features =
    research?.features ?? [];

  const signals =
    research?.signals ?? [];

  const regime =
    research?.regime ?? null;

  const hypothesis =
    research?.hypothesis ?? null;

  const evidence =
    research?.evidence ?? [];

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
              Research
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Explore market features, signals, regimes, hypotheses,
              and supporting evidence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch?.()}
              disabled={loading}
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
            >
              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <Link href="/research/new">
              <Button>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Research
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
              : "Research Ready"}
          </Badge>

          <span className="text-[10px] text-slate-600">
            Feature → Signal → Regime → Hypothesis → Evidence
          </span>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-red-400">
                  Research data unavailable
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

        {/* Research workspace */}
        <div className="grid gap-5 xl:grid-cols-4">
          {/* Left sidebar */}
          <aside className="xl:col-span-1">
            <Card className="p-4">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-500" />

                <div>
                  <h2 className="text-xs font-semibold text-white">
                    Research Workspace
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Select a feature or study.
                  </p>
                </div>
              </div>

              <FeatureSelector
                features={features}
                loading={loading}
              />

              <div className="my-5 border-t border-slate-900" />

              <div className="mb-3 text-[10px] uppercase tracking-wider text-slate-600">
                Recent Studies
              </div>

              {studies.length === 0 ? (
                <div className="py-5 text-center">
                  <BrainCircuit className="mx-auto h-5 w-5 text-slate-700" />

                  <p className="mt-2 text-[11px] text-slate-600">
                    No research studies yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {studies.slice(0, 8).map(
                    (study: {
                      id: string;
                      title?: string;
                      symbol?: string;
                      status?: string;
                    }) => (
                      <Link
                        key={study.id}
                        href={`/research/${study.id}`}
                        className="group block rounded-lg border border-transparent p-2.5 transition hover:border-slate-800 hover:bg-slate-950"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[11px] text-slate-400 group-hover:text-white">
                            {study.title ??
                              "Untitled Study"}
                          </span>

                          <ArrowRight className="h-3 w-3 shrink-0 text-slate-700 group-hover:text-slate-400" />
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-700">
                          {study.symbol && (
                            <span>
                              {study.symbol}
                            </span>
                          )}

                          {study.status && (
                            <>
                              <span>•</span>
                              <span>
                                {study.status}
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </Card>
          </aside>

          {/* Main workspace */}
          <main className="space-y-5 xl:col-span-3">
            {/* Active study */}
            <Card className="p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-slate-500" />

                    <span className="text-[10px] uppercase tracking-wider text-slate-600">
                      Active Analysis
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-white">
                    {activeStudy?.title ??
                      "Market Research Workspace"}
                  </h2>

                  <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-600">
                    {activeStudy?.description ??
                      "Investigate quantitative relationships between market features, positioning, signals, and regimes."}
                  </p>
                </div>

                {activeStudy?.id && (
                  <Link
                    href={`/research/${activeStudy.id}`}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-white"
                  >
                    Open report
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </Card>

            {/* Features */}
            <section>
              <SectionHeader
                icon={Activity}
                title="Features"
                description="Quantitative features generated by the backend."
              />

              <FeaturePanel
                features={features}
                loading={loading}
              />
            </section>

            {/* Signal + Regime */}
            <section className="grid gap-5 lg:grid-cols-2">
              <div>
                <SectionHeader
                  icon={Sparkles}
                  title="Signal"
                  description="Current model and market signals."
                />

                <SignalPanel
                  signals={signals}
                  loading={loading}
                />
              </div>

              <div>
                <SectionHeader
                  icon={BrainCircuit}
                  title="Regime"
                  description="Current market regime classification."
                />

                <RegimePanel
                  regime={regime}
                  loading={loading}
                />
              </div>
            </section>

            {/* Hypothesis */}
            <section>
              <SectionHeader
                icon={FlaskConical}
                title="Hypothesis"
                description="Research hypothesis generated from market evidence."
              />

              <HypothesisPanel
                hypothesis={hypothesis}
                loading={loading}
              />
            </section>

            {/* Evidence */}
            <section>
              <SectionHeader
                icon={Search}
                title="Evidence"
                description="Quantitative evidence supporting or challenging the hypothesis."
              />

              <EvidencePanel
                evidence={evidence}
                loading={loading}
              />
            </section>
          </main>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />

        <h2 className="text-sm font-semibold text-white">
          {title}
        </h2>
      </div>

      <p className="mt-1 text-[11px] text-slate-600">
        {description}
      </p>
    </div>
  );
}
