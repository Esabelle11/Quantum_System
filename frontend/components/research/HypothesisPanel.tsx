
// frontend/components/research/HypothesisPanel.tsx

import {
  HelpCircle,
  Target,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type HypothesisStatus =
  | "OPEN"
  | "SUPPORTED"
  | "REJECTED"
  | "INCONCLUSIVE";

interface HypothesisPanelProps {
  title: string;
  description: string;

  status?: HypothesisStatus;

  expectedRelationship?: string;

  targetFeature?: string;

  timeframe?: string;

  loading?: boolean;
}

export default function HypothesisPanel({
  title,
  description,
  status = "OPEN",
  expectedRelationship,
  targetFeature,
  timeframe,
  loading = false,
}: HypothesisPanelProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 rounded bg-slate-800" />
          <div className="h-16 rounded bg-slate-800" />
          <div className="h-5 w-32 rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const badgeVariant =
    status === "SUPPORTED"
      ? "success"
      : status === "REJECTED"
      ? "danger"
      : "default";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-blue-400" />

          <h3 className="text-sm font-semibold text-white">
            Research Hypothesis
          </h3>
        </div>

        <Badge variant={badgeVariant}>
          {status}
        </Badge>
      </div>

      <div className="mt-5">
        <h4 className="text-base font-semibold text-slate-100">
          {title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {expectedRelationship && (
          <ResearchField
            label="Expected Relationship"
            value={
              expectedRelationship
            }
          />
        )}

        {targetFeature && (
          <ResearchField
            label="Target Feature"
            value={targetFeature}
          />
        )}

        {timeframe && (
          <ResearchField
            label="Timeframe"
            value={timeframe}
          />
        )}
      </div>
    </Card>
  );
}

interface ResearchFieldProps {
  label: string;
  value: string;
}

function ResearchField({
  label,
  value,
}: ResearchFieldProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-300">
        <Target className="h-3 w-3 text-blue-400" />

        {value}
      </div>
    </div>
  );
}