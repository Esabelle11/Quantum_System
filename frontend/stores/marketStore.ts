
// frontend/stores/marketStore.ts

"use client";

import {
  create
} from "zustand";

import {
  DEFAULT_INTERVAL,
  DEFAULT_SYMBOL
} from "@/lib/constants";

interface MarketState {
  symbol: string;
  interval: string;

  setSymbol: (
    symbol: string
  ) => void;

  setInterval: (
    interval: string
  ) => void;
}

export const useMarketStore =
  create<MarketState>((set) => ({
    symbol: DEFAULT_SYMBOL,

    interval: DEFAULT_INTERVAL,

    setSymbol: (
      symbol
    ) =>
      set({
        symbol
      }),

    setInterval: (
      interval
    ) =>
      set({
        interval
      })
  }));




// Now components can do:
//   const symbol =
//     useMarketStore(
//       (state) => state.symbol
//     );