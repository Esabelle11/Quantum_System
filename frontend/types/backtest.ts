
// frontend/types/backtest.ts

/**
 * Backtest request.
 */
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

/**
 * Single executed backtest trade.
 */
export interface BacktestTrade {
  timestamp: number;

  side:
    | "long"
    | "short"
    | "buy"
    | "sell"
    | string;

  price: number;

  quantity: number;

  value?: number;

  pnl?: number;

  fees?: number;

  positionSize?: number;
}

/**
 * Equity curve point.
 */
export interface EquityPoint {
  timestamp: number;

  equity: number;

  drawdown?: number;

  drawdownPct?: number;
}

/**
 * Backtest performance metrics.
 */
export interface BacktestMetrics {
  totalReturn: number;

  totalReturnPct?: number;

  annualizedReturn?: number;

  sharpeRatio?: number;

  sortinoRatio?: number;

  calmarRatio?: number;

  maxDrawdown?: number;

  maxDrawdownPct?: number;

  volatility?: number;

  winRate?: number;

  profitFactor?: number;

  expectancy?: number;

  totalTrades?: number;

  winningTrades?: number;

  losingTrades?: number;

  averageWin?: number;

  averageLoss?: number;

  totalFees?: number;
}

/**
 * Complete backtest result.
 */
export interface BacktestResult {
  id?: string;

  symbol: string;

  strategy: string;

  start: string;

  end: string;

  initialCapital: number;

  finalCapital?: number;

  metrics: BacktestMetrics;

  equityCurve?: EquityPoint[];

  trades?: BacktestTrade[];

  createdAt?: string;
}

/**
 * Backtest status.
 */
export type BacktestStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed";

/**
 * Backtest execution state.
 */
export interface BacktestRun {
  id?: string;

  status: BacktestStatus;

  progress?: number;

  result?: BacktestResult;

  error?: string;
}

