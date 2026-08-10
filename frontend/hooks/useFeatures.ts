
// frontend/hooks/useFeatures.ts

"use client";

import {
  useQuery
} from "@tanstack/react-query";

import {
  getFeatures,
  getPriceFeatures,
  getVolatilityFeatures,
  getFundingFeatures,
  getOIFeatures,
  getLiquidationFeatures
} from "@/lib/api/features";

interface FeatureQueryOptions {
  enabled?: boolean;
  start?: string;
  end?: string;
  interval?: string;
}

export function useFeatures(
  symbol: string,
  options: FeatureQueryOptions = {}
) {
  return useQuery({
    queryKey: [
      "features",
      symbol,
      options.start,
      options.end,
      options.interval
    ],

    queryFn: () =>
      getFeatures(symbol, {
        start: options.start,
        end: options.end,
        interval: options.interval
      }),

    enabled:
      Boolean(symbol) &&
      (options.enabled ?? true)
  });
}

export function usePriceFeatures(
  symbol: string,
  options: FeatureQueryOptions = {}
) {
  return useQuery({
    queryKey: [
      "features",
      "price",
      symbol,
      options.start,
      options.end,
      options.interval
    ],

    queryFn: () =>
      getPriceFeatures(symbol, {
        start: options.start,
        end: options.end,
        interval: options.interval
      }),

    enabled:
      Boolean(symbol) &&
      (options.enabled ?? true)
  });
}

export function useVolatilityFeatures(
  symbol: string,
  options: FeatureQueryOptions = {}
) {
  return useQuery({
    queryKey: [
      "features",
      "volatility",
      symbol,
      options.start,
      options.end,
      options.interval
    ],

    queryFn: () =>
      getVolatilityFeatures(symbol, {
        start: options.start,
        end: options.end,
        interval: options.interval
      }),

    enabled:
      Boolean(symbol) &&
      (options.enabled ?? true)
  });
}

export function useFundingFeatures(
  symbol: string,
  options: FeatureQueryOptions = {}
) {
  return useQuery({
    queryKey: [
      "features",
      "funding",
      symbol,
      options.start,
      options.end,
      options.interval
    ],

    queryFn: () =>
      getFundingFeatures(symbol, {
        start: options.start,
        end: options.end,
        interval: options.interval
      }),

    enabled:
      Boolean(symbol) &&
      (options.enabled ?? true)
  });
}

export function useOIFeatures(
  symbol: string,
  options: FeatureQueryOptions = {}
) {
  return useQuery({
    queryKey: [
      "features",
      "oi",
      symbol,
      options.start,
      options.end,
      options.interval
    ],

    queryFn: () =>
      getOIFeatures(symbol, {
        start: options.start,
        end: options.end,
        interval: options.interval
      }),

    enabled:
      Boolean(symbol) &&
      (options.enabled ?? true)
  });
}

export function useLiquidationFeatures(
  symbol: string,
  options: FeatureQueryOptions = {}
) {
  return useQuery({
    queryKey: [
      "features",
      "liquidation",
      symbol,
      options.start,
      options.end,
      options.interval
    ],

    queryFn: () =>
      getLiquidationFeatures(symbol, {
        start: options.start,
        end: options.end,
        interval: options.interval
      }),

    enabled:
      Boolean(symbol) &&
      (options.enabled ?? true)
  });
}

