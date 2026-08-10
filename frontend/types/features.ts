
// frontend/types/features.ts

import type {
  Timeframe
} from "./market";

/**
 * Generic numeric feature map.
 *
 * Allows the backend to introduce new features
 * without requiring the frontend to immediately
 * know every individual field.
 */
export type FeatureValues =
  Record<
    string,
    number | null
  >;

/**
 * Price-derived features.
 */
export interface PriceFeatures
  extends FeatureValues {
  return_1?: number | null;
  return_5?: number | null;
  return_15?: number | null;

  momentum?: number | null;

  price_change?: number | null;
  price_change_pct?: number | null;
}

/**
 * Volatility-derived features.
 */
export interface VolatilityFeatures
  extends FeatureValues {
  realized_volatility?: number | null;

  volatility_5?: number | null;
  volatility_15?: number | null;
  volatility_30?: number | null;

  atr?: number | null;
}

/**
 * Funding-derived features.
 */
export interface FundingFeatures
  extends FeatureValues {
  funding_rate?: number | null;

  funding_rate_ma?: number | null;

  funding_zscore?: number | null;

  funding_change?: number | null;
}

/**
 * Open-interest-derived features.
 */
export interface OIFeatures
  extends FeatureValues {
  open_interest?: number | null;

  open_interest_change?: number | null;

  open_interest_change_pct?: number | null;

  oi_price_divergence?: number | null;
}

/**
 * Liquidation-derived features.
 */
export interface LiquidationFeatures
  extends FeatureValues {
  long_liquidation_volume?: number | null;

  short_liquidation_volume?: number | null;

  total_liquidation_volume?: number | null;

  liquidation_imbalance?: number | null;
}

/**
 * Complete feature snapshot.
 */
export interface FeatureSnapshot {
  timestamp: number;

  symbol?: string;

  timeframe?: Timeframe;

  price?: PriceFeatures;

  volatility?: VolatilityFeatures;

  funding?: FundingFeatures;

  oi?: OIFeatures;

  liquidation?: LiquidationFeatures;
}

/**
 * Collection of feature snapshots.
 */
export type FeatureSeries =
  FeatureSnapshot[];

/**
 * Feature category.
 */
export type FeatureCategory =
  | "price"
  | "volatility"
  | "funding"
  | "oi"
  | "liquidation";

/**
 * Request for feature data.
 */
export interface FeatureQuery {
  symbol: string;

  start?: string;
  end?: string;

  interval?: Timeframe;

  features?: FeatureCategory[];
}

