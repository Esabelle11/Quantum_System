
// frontend/types/strategy.ts

/**
 * Strategy configuration.
 */
export interface Strategy {
  id: string;

  name: string;

  description?: string;

  enabled: boolean;

  parameters?: Record<
    string,
    string | number | boolean
  >;

  signalConfig?: SignalConfig;

  regimeConfig?: RegimeConfig;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * Signal configuration.
 *
 * Keep this flexible because the backend
 * strategy implementation may evolve.
 */
export interface SignalConfig {
  type?: string;

  threshold?: number;

  lookback?: number;

  parameters?: Record<
    string,
    string | number | boolean
  >;
}

/**
 * Market regime configuration.
 */
export interface RegimeConfig {
  type?: string;

  lookback?: number;

  thresholds?: Record<
    string,
    number
  >;

  parameters?: Record<
    string,
    string | number | boolean
  >;
}

/**
 * Create strategy request.
 */
export interface CreateStrategyRequest {
  name: string;

  description?: string;

  parameters?: Record<
    string,
    string | number | boolean
  >;

  signalConfig?: SignalConfig;

  regimeConfig?: RegimeConfig;
}

/**
 * Strategy signal.
 */
export interface StrategySignal {
  timestamp: number;

  symbol: string;

  signal:
    | "long"
    | "short"
    | "neutral"
    | "buy"
    | "sell"
    | string;

  strength?: number;

  confidence?: number;

  reason?: string;
}

/**
 * Market regime.
 */
export interface MarketRegime {
  timestamp: number;

  symbol: string;

  regime:
    | "bull"
    | "bear"
    | "sideways"
    | "high_volatility"
    | "low_volatility"
    | string;

  confidence?: number;

  score?: number;
}

