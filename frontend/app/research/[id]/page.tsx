
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  FlaskConical,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { useParams } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import FeaturePanel from "@/components/research/FeaturePanel";
import SignalPanel from "@/components/research/SignalPanel";
import RegimePanel from "@/components/research/RegimePanel";
import HypothesisPanel from "@/components/research/HypothesisPanel";
import EvidencePanel from "@/components/research/EvidencePanel";
import ResearchReport from "@/components/research/ResearchReport";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useResearch } from "@/hooks/useResearch";

export default function ResearchDetailPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const id = params?.id;

  const {
    research,
    loading,
    error,
    refetch,
  } = useResearch(id);

  const study =
    research?.study ?? null;

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

  const report =
    research?.report ?? null;

  return (
    <AppShell>
      <PageContainer>
        {/* Back */}
        <Link
          href="/research"
          className="mb-5 inline-flex items-center gap-2 text-[11px] text-slate-600 transition hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to research
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <FlaskConical className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Research Study
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
                  : "Complete"}
              </Badge>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              {study?.title ??
                "Research Analysis"}
            </h1>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
              {study?.description ??
                "Detailed quantitative research analysis and supporting evidence."}
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
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs font-medium text-red-400">
              Unable to load research study
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              {error}
            </div>
          </Card>
        )}

        {/* Study metadata */}
        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaCard
            icon={BarChart3}
            label="Symbol"
            value={
              study?.symbol ??
              "BTCUSDT"
            }
          />

          <MetaCard
            icon={Activity}
            label="Timeframe"
            value={
              study?.timeframe ??
              "Unknown"
            }
          />

          <MetaCard
            icon={Calendar}
            label="Created"
            value={
              study?.createdAt
                ? formatDate(
                    study.createdAt
                  )
                : "Unknown"
            }
          />

          <MetaCard
            icon={CheckCircle2}
            label="Status"
            value={
              study?.status ??
              "Ready"
            }
          />
        </section>

        {/* Research pipeline */}
        <section className="mb-6">
          <Card className="p-5">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-slate-500" />

                <h2 className="text-sm font-semibold text-white">
                  Research Pipeline
                </h2>
              </div>

              <p className="mt-1 text-[11px] text-slate-600">
                How this research moves from raw features to an evidence-backed conclusion.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              <PipelineStep
                number="01"
                title="Features"
                description="Market variables"
                active={features.length > 0}
              />

              <PipelineStep
                number="02"
                title="Signals"
                description="Derived signals"
                active={signals.length > 0}
              />

              <PipelineStep
                number="03"
                title="Regime"
                description="Market state"
                active={Boolean(regime)}
              />

              <PipelineStep
                number="04"
                title="Hypothesis"
                description="Research claim"
                active={Boolean(
                  hypothesis
                )}
              />

              <PipelineStep
                number="05"
                title="Evidence"
                description="Validation"
                active={evidence.length > 0}
              />
            </div>
          </Card>
        </section>

        {/* Feature analysis */}
        <section className="mb-6">
          <SectionHeader
            icon={Activity}
            title="Feature Analysis"
            description="Quantitative variables used in this research."
          />

          <FeaturePanel
            features={features}
            loading={loading}
          />
        </section>

        {/* Signal + Regime */}
        <section className="mb-6 grid gap-5 lg:grid-cols-2">
          <div>
            <SectionHeader
              icon={Sparkles}
              title="Signal Analysis"
              description="Signals derived from market and feature data."
            />

            <SignalPanel
              signals={signals}
              loading={loading}
            />
          </div>

          <div>
            <SectionHeader
              icon={BrainCircuit}
              title="Market Regime"
              description="Regime classification associated with this study."
            />

            <RegimePanel
              regime={regime}
              loading={loading}
            />
          </div>
        </section>

        {/* Hypothesis */}
        <section className="mb-6">
          <SectionHeader
            icon={FlaskConical}
            title="Research Hypothesis"
            description="The central hypothesis being evaluated."
          />

          <HypothesisPanel
            hypothesis={hypothesis}
            loading={loading}
          />
        </section>

        {/* Evidence */}
        <section className="mb-6">
          <SectionHeader
            icon={Search}
            title="Evidence"
            description="Observations and quantitative evidence related to the hypothesis."
          />

          <EvidencePanel
            evidence={evidence}
            loading={loading}
          />
        </section>

        {/* Final report */}
        <section className="mb-6">
          <SectionHeader
            icon={CheckCircle2}
            title="Research Report"
            description="Final interpretation generated by the analysis pipeline."
          />

          <ResearchReport
            report={report}
            loading={loading}
          />
        </section>

        {/* Research conclusion */}
        {report && (
          <Card className="border-slate-800 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                <CheckCircle2 className="h-4 w-4 text-slate-500" />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-600">
                  Analysis Complete
                </div>

                <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                  This report combines quantitative features,
                  derived signals, market regime information,
                  hypotheses, and supporting evidence.
                </p>
              </div>
            </div>
          </Card>
        )}
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

function PipelineStep({
  number,
  title,
  description,
  active,
}: {
  number: string;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        active
          ? "border-slate-800 bg-slate-950"
          : "border-slate-900 bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-medium tracking-wider text-slate-700">
          {number}
        </span>

        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active
              ? "bg-emerald-400"
              : "bg-slate-800"
          }`}
        />
      </div>

      <div className="mt-3 text-xs font-medium text-slate-300">
        {title}
      </div>

      <div className="mt-1 text-[10px] text-slate-600">
        {description}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-MY",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}
