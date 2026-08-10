
// frontend/components/research/EvidencePanel.tsx

import {
  CheckCircle2,
  CircleAlert,
  XCircle,
} from "lucide-react";

import Card from "@/components/ui/Card";

type EvidenceType =
  | "SUPPORTING"
  | "CONTRADICTING"
  | "NEUTRAL";

interface Evidence {
  id: string;

  feature: string;

  observation: string;

  impact: string;

  type: EvidenceType;

  strength?: number | null;
}

interface EvidencePanelProps {
  evidence: Evidence[];

  loading?: boolean;
}

export default function EvidencePanel({
  evidence,
  loading = false,
}: EvidencePanelProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-3">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded bg-slate-900"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Evidence
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Observations supporting or contradicting the research hypothesis.
        </p>
      </div>

      {evidence.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-600">
          No evidence available.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {evidence.map((item) => (
            <EvidenceRow
              key={item.id}
              evidence={item}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

interface EvidenceRowProps {
  evidence: Evidence;
}

function EvidenceRow({
  evidence,
}: EvidenceRowProps) {
  const supporting =
    evidence.type ===
    "SUPPORTING";

  const contradicting =
    evidence.type ===
    "CONTRADICTING";

  const Icon = supporting
    ? CheckCircle2
    : contradicting
    ? XCircle
    : CircleAlert;

  const iconClass = supporting
    ? "text-emerald-400"
    : contradicting
    ? "text-red-400"
    : "text-yellow-400";

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <div className="flex gap-3">
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-200">
              {evidence.feature}
            </span>

            {evidence.strength !==
              null &&
              evidence.strength !==
                undefined && (
                <span className="text-xs text-slate-500">
                  Strength{" "}
                  {evidence.strength.toFixed(
                    1
                  )}
                </span>
              )}
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {evidence.observation}
          </p>

          <div className="mt-3 border-l border-slate-700 pl-3 text-xs text-slate-500">
            {evidence.impact}
          </div>
        </div>
      </div>
    </div>
  );
}