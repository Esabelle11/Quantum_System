
// frontend/lib/api/research.ts

/**
 * Research API layer.
 *
 * Backend:
 *
 * app/analysis/
 * ├── analyzer.py
 * ├── hypothesis.py
 * ├── evidence.py
 * └── report.py
 *
 * FastAPI endpoints will be connected here
 * once the analysis layer is exposed.
 */

// TODO:
// getResearchReports()
// getResearchReport()
// runResearch()
// createHypothesis()
// getEvidence()

export {};



// frontend/lib/api/research.ts

import { apiGet, apiPost } from "./client";

export interface ResearchHypothesis {
  id?: string;
  title: string;
  description: string;
}

export interface ResearchEvidence {
  id?: string;
  metric: string;
  value: number | string;
  interpretation?: string;
}

export interface ResearchReport {
  id?: string;
  title: string;
  summary: string;
  hypothesis?: ResearchHypothesis;
  evidence?: ResearchEvidence[];
  conclusion?: string;
}

export interface ResearchRequest {
  symbol: string;
  start?: string;
  end?: string;
  features?: string[];
  hypothesis?: string;
}

export function runResearch(
  request: ResearchRequest
) {
  return apiPost<ResearchReport>(
    "/api/research",
    request
  );
}

export function getResearchReports(
  symbol?: string
) {
  return apiGet<ResearchReport[]>(
    "/api/research",
    symbol ? { symbol } : undefined
  );
}

export function getResearchReport(
  id: string
) {
  return apiGet<ResearchReport>(
    `/api/research/${id}`
  );
}
