
// frontend/types/database.ts

/**
 * Generic database row metadata.
 */
export interface BaseRow {
  id: string;

  created_at?: string;

  updated_at?: string;
}

/**
 * Market data row.
 *
 * This is intentionally generic during
 * the construction phase.
 */
export interface MarketDataRow
  extends BaseRow {
  symbol: string;

  timestamp: number;

  open?: number;
  high?: number;
  low?: number;
  close?: number;

  volume?: number;
}

/**
 * Research report database row.
 */
export interface ResearchReportRow
  extends BaseRow {
  symbol: string;

  title: string;

  summary?: string;

  hypothesis?: string;

  conclusion?: string;
}

/**
 * Strategy database row.
 */
export interface StrategyRow
  extends BaseRow {
  name: string;

  description?: string;

  enabled: boolean;

  parameters?: Record<
    string,
    unknown
  >;
}

/**
 * Backtest database row.
 */
export interface BacktestRow
  extends BaseRow {
  symbol: string;

  strategy: string;

  start_time: string;

  end_time: string;

  initial_capital: number;

  final_capital?: number;

  metrics?: Record<
    string,
    unknown
  >;
}

/**
 * Generic database response.
 */
export interface DatabaseResponse<T> {
  data: T | null;

  error: string | null;
}

