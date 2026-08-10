
// frontend/lib/api/backtest.ts

/**
 * Backtest API layer.
 *
 * Backend:
 *
 * app/backtest/
 * ├── engine.py
 * ├── strategy.py
 * ├── portfolio.py
 * └── metrics.py
 */

// TODO:
// runBacktest()
// getBacktest()
// getBacktests()
// getBacktestTrades()
// getBacktestMetrics()

export {};




// frontend/lib/api/backtest.ts

import { apiGet, apiPost } from "./client";


export interface BacktestRequest {
  symbol: string;
  strategy: string;

  start: string;
  end: string;

  initialCapital: number;

  interval?: string;

  parameters?: Record<
    string,
    string | number | boolean
  >;
}

export interface BacktestMetrics {
  totalReturn: number;
  annualizedReturn?: number;
  sharpeRatio?: number;
  sortinoRatio?: number;
  maxDrawdown?: number;
  winRate?: number;
  profitFactor?: number;
  totalTrades?: number;
}

export interface BacktestTrade {
  timestamp: number;
  side: "long" | "short" | "buy" | "sell" | string;
  price: number;
  quantity: number;
  pnl?: number;
}

export interface EquityPoint {
  timestamp: number;
  equity: number;
}

export interface BacktestResult {
  id?: string;
  symbol: string;
  strategy: string;

  metrics: BacktestMetrics;

  equityCurve?: EquityPoint[];

  trades?: BacktestTrade[];
}

export function runBacktest(
  request: BacktestRequest
) {
  return apiPost<BacktestResult>(
    "/api/backtest",
    request
  );
}

export function getBacktest(
  id: string
) {
  return apiGet<BacktestResult>(
    `/api/backtest/${id}`
  );
}

export function getBacktests(
  symbol?: string
) {
  return apiGet<BacktestResult[]>(
    "/api/backtest",
    symbol ? { symbol } : undefined
  );
}


