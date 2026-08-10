
// frontend/stores/tradingStore.ts

"use client";

import {
  create
} from "zustand";

type TradingMode =
  | "paper"
  | "live";

type OrderSide =
  | "Buy"
  | "Sell";

interface TradingState {
  mode: TradingMode;

  orderSide: OrderSide;

  selectedSymbol: string;

  orderType: string;

  quantity: number;

  price: number | null;

  setMode: (
    mode: TradingMode
  ) => void;

  setOrderSide: (
    side: OrderSide
  ) => void;

  setSelectedSymbol: (
    symbol: string
  ) => void;

  setOrderType: (
    type: string
  ) => void;

  setQuantity: (
    quantity: number
  ) => void;

  setPrice: (
    price: number | null
  ) => void;

  resetOrder: () => void;
}

export const useTradingStore =
  create<TradingState>((set) => ({
    mode: "paper",

    orderSide: "Buy",

    selectedSymbol: "BTCUSDT",

    orderType: "Market",

    quantity: 0,

    price: null,

    setMode: (
      mode
    ) =>
      set({
        mode
      }),

    setOrderSide: (
      orderSide
    ) =>
      set({
        orderSide
      }),

    setSelectedSymbol: (
      selectedSymbol
    ) =>
      set({
        selectedSymbol
      }),

    setOrderType: (
      orderType
    ) =>
      set({
        orderType
      }),

    setQuantity: (
      quantity
    ) =>
      set({
        quantity
      }),

    setPrice: (
      price
    ) =>
      set({
        price
      }),

    resetOrder: () =>
      set({
        orderSide: "Buy",
        orderType: "Market",
        quantity: 0,
        price: null
      })
  }));




//   I deliberately defaulted this to:
//      PAPER
//   rather than live trading.
//   That's a good safety boundary while you're constructing the system.