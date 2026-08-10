
// frontend/hooks/useMarket.ts

"use client";

import {
  useQuery
} from "@tanstack/react-query";

import {
  getBTCMarket,
  getBTCKlines
} from "@/lib/api/market";

export function useBTCMarket() {
  return useQuery({
    queryKey: ["market", "BTCUSDT"],
    queryFn: getBTCMarket,

    // Market price changes frequently.
    refetchInterval: 5_000,

    staleTime: 2_000
  });
}

export function useBTCKlines() {
  return useQuery({
    queryKey: [
      "market",
      "BTCUSDT",
      "klines"
    ],

    queryFn: getBTCKlines,

    staleTime: 10_000
  });
}


// This corresponds directly to your current backend:
// GET /api/market/btcusdt
// GET /api/market/btcusdt/klines