
// frontend/types/research.ts

import type {
  FeatureCategory
} from "./features";

/**
 * Research hypothesis.
 */
export interface ResearchHypothesis {
  id?: string;

  title: string;

  description: string;

  symbol?: string;

  createdAt?: string;
}

/**
 * Evidence supporting or contradicting
 * a research hypothesis.
 */
export interface ResearchEvidence {
  id?: string;

  metric: string;

  value: number | string;

  unit?: string;

  interpretation?: string;

  supportsHypothesis?: boolean;

  timestamp?: number;
}

/**
 * Research conclusion.
 */
export interface ResearchConclusion {
  summary: string;

  confidence?: number;

  limitations?: string[];
}

/**
 * Research report.
 */
export interface ResearchReport {
  id?: string;

  title: string;

  summary: string;

  symbol: string;

  hypothesis?: ResearchHypothesis;

  features?: FeatureCategory[];

  evidence?: ResearchEvidence[];

  conclusion?: ResearchConclusion;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * Research request.
 */
export interface ResearchRequest {
  symbol: string;

  start?: string;

  end?: string;

  features?: FeatureCategory[];

  hypothesis?: string;
}

/**
 * Research status.
 */
export type ResearchStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed";

/**
 * Research execution state.
 */
export interface ResearchRun {
  id?: string;

  status: ResearchStatus;

  progress?: number;

  report?: ResearchReport;

  error?: string;
}

