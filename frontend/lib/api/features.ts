
// frontend/lib/api/features.ts

/**
 * Feature API layer.
 *
 * Backend feature endpoints will be connected here
 * once they are exposed through FastAPI.
 *
 * Current backend feature modules:
 *
 * app/features/
 * ├── price_features.py
 * ├── volatility_features.py
 * ├── funding_features.py
 * ├── oi_features.py
 * └── liquidation_features.py
 */

// TODO:
// Connect to FastAPI feature endpoints.
//
// Planned functions:
//
// getPriceFeatures()
// getVolatilityFeatures()
// getFundingFeatures()
// getOIFeatures()
// getLiquidationFeatures()
// getAllFeatures()

export {};



// frontend/lib/api/features.ts

import { apiGet } from "./client";

export interface PriceFeatures {
  [key: string]: number | null;
}

export interface VolatilityFeatures {
  [key: string]: number | null;
}

export interface FundingFeatures {
  [key: string]: number | null;
}

export interface OIFeatures {
  [key: string]: number | null;
}

export interface LiquidationFeatures {
  [key: string]: number | null;
}

export interface FeatureSnapshot {
  timestamp: number;

  price?: PriceFeatures;
  volatility?: VolatilityFeatures;
  funding?: FundingFeatures;
  oi?: OIFeatures;
  liquidation?: LiquidationFeatures;
}

export function getFeatures(
  symbol: string,
  params?: {
    start?: string;
    end?: string;
    interval?: string;
  }
) {
  return apiGet<FeatureSnapshot[]>(
    `/api/features/${symbol}`,
    params
  );
}

export function getPriceFeatures(
  symbol: string,
  params?: {
    start?: string;
    end?: string;
    interval?: string;
  }
) {
  return apiGet<FeatureSnapshot[]>(
    `/api/features/${symbol}/price`,
    params
  );
}

export function getVolatilityFeatures(
  symbol: string,
  params?: {
    start?: string;
    end?: string;
    interval?: string;
  }
) {
  return apiGet<FeatureSnapshot[]>(
    `/api/features/${symbol}/volatility`,
    params
  );
}

export function getFundingFeatures(
  symbol: string,
  params?: {
    start?: string;
    end?: string;
    interval?: string;
  }
) {
  return apiGet<FeatureSnapshot[]>(
    `/api/features/${symbol}/funding`,
    params
  );
}

export function getOIFeatures(
  symbol: string,
  params?: {
    start?: string;
    end?: string;
    interval?: string;
  }
) {
  return apiGet<FeatureSnapshot[]>(
    `/api/features/${symbol}/oi`,
    params
  );
}

export function getLiquidationFeatures(
  symbol: string,
  params?: {
    start?: string;
    end?: string;
    interval?: string;
  }
) {
  return apiGet<FeatureSnapshot[]>(
    `/api/features/${symbol}/liquidation`,
    params
  );
}

