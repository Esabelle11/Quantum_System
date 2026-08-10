
// frontend/hooks/useBacktest.ts

"use client";

import {
  useMutation,
  useQuery
} from "@tanstack/react-query";

import {
  getBacktest,
  getBacktests,
  runBacktest,
  type BacktestRequest
} from "@/lib/api/backtest";

export function useBacktests(
  symbol?: string
) {
  return useQuery({
    queryKey: [
      "backtest",
      "list",
      symbol
    ],

    queryFn: () =>
      getBacktests(symbol)
  });
}

export function useBacktest(
  id: string
) {
  return useQuery({
    queryKey: [
      "backtest",
      id
    ],

    queryFn: () =>
      getBacktest(id),

    enabled: Boolean(id)
  });
}

export function useRunBacktest() {
  return useMutation({
    mutationFn: (
      request: BacktestRequest
    ) => runBacktest(request)
  });
}



// Later we can add:
// BacktestForm
//     ↓
// useRunBacktest()
//     ↓
// FastAPI
//     ↓
// BacktestEngine
//     ↓
// BacktestResult
//     ↓
// EquityCurve
// DrawdownChart
// TradeTable
