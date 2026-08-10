
// frontend/components/research/ResearchReport.tsx

import {
  FileText,
  Calendar,
  Target,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface ResearchReportProps {
  title: string;

  summary: string;

  conclusion?: string;

  generatedAt?: string;

  confidence?: number | null;

  recommendation?: string;

  limitations?: string[];

  loading?: boolean;
}

export default function ResearchReport({
  title,
  summary,
  conclusion,
  generatedAt,
  confidence,
  recommendation,
  limitations = [],
  loading = false,
}: ResearchReportProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-5">
          <div className="h-6 w-56 rounded bg-slate-800" />
          <div className="h-20 rounded bg-slate-800" />
          <div className="h-20 rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" />

            <span className="text-xs uppercase tracking-wider text-slate-500">
              Research Report
            </span>
          </div>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {title}
          </h2>
        </div>

        {confidence !==
          null &&
          confidence !==
            undefined && (
            <Badge
              variant={
                confidence >= 70
                  ? "success"
                  : confidence >=
                    40
                  ? "warning"
                  : "default"
              }
            >
              Confidence{" "}
              {confidence.toFixed(
                1
              )}
              %
            </Badge>
          )}
      </div>

      {generatedAt && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" />

          Generated{" "}
          {generatedAt}
        </div>
      )}

      <section className="mt-6">
        <SectionTitle>
          Executive Summary
        </SectionTitle>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          {summary}
        </p>
      </section>

      {conclusion && (
        <section className="mt-6">
          <SectionTitle>
            Conclusion
          </SectionTitle>

          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm leading-6 text-slate-300">
              {conclusion}
            </p>
          </div>
        </section>
      )}

      {recommendation && (
        <section className="mt-6">
          <SectionTitle>
            Research Implication
          </SectionTitle>

          <div className="mt-3 flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

            <p className="text-sm leading-6 text-slate-300">
              {recommendation}
            </p>
          </div>
        </section>
      )}

      {limitations.length > 0 && (
        <section className="mt-6">
          <SectionTitle>
            Limitations
          </SectionTitle>

          <ul className="mt-3 space-y-2">
            {limitations.map(
              (limitation, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-xs leading-5 text-slate-500"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />

                  {limitation}
                </li>
              )
            )}
          </ul>
        </section>
      )}
    </Card>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  );
}