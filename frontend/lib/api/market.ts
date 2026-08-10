

// frontend/lib/api/market.ts

import { apiGet } from "./client";

/**
 * Current BTC market response from FastAPI.
 *
 * Backend:
 * GET /api/market/btcusdt
 */
export interface BTCMarket {
  symbol: string;
  price: number;
}

/**
 * Kline returned by the backend.
 *
 * NOTE:
 * The exact fields depend on what
 * KlineCollector.collect() currently returns.
 *
 * We keep this flexible during the
 * construction phase.
 */
export interface Kline {
  timestamp?: number | string;

  open?: number;
  high?: number;
  low?: number;
  close?: number;

  volume?: number;

  [key: string]: unknown;
}

export interface BTCKlinesResponse {
  symbol: string;
  count: number;
  data: Kline[];
}

/**
 * Get current BTCUSDT market price.
 */
export function getBTCMarket() {
  return apiGet<BTCMarket>(
    "/api/market/btcusdt"
  );
}

/**
 * Get BTCUSDT klines.
 */
export function getBTCKlines() {
  return apiGet<BTCKlinesResponse>(
    "/api/market/btcusdt/klines"
  );
}




// frontend/lib/api/market.ts

// import { apiGet } from "./client";

// export interface Kline {
//   timestamp: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// export interface FundingRate {
//   timestamp: number;
//   symbol: string;
//   fundingRate: number;
// }

// export interface OpenInterest {
//   timestamp: number;
//   symbol: string;
//   openInterest: number;
// }

// export interface Liquidation {
//   timestamp: number;
//   symbol: string;
//   side: "Buy" | "Sell" | string;
//   price: number;
//   quantity: number;
// }

// export interface Trade {
//   timestamp: number;
//   symbol: string;
//   side: "Buy" | "Sell" | string;
//   price: number;
//   quantity: number;
// }

// export interface OrderBookLevel {
//   price: number;
//   quantity: number;
// }

// export interface OrderBook {
//   timestamp: number;
//   bids: OrderBookLevel[];
//   asks: OrderBookLevel[];
// }

// /*
//  * IMPORTANT:
//  * These endpoint paths are placeholders until we inspect
//  * your FastAPI main.py/router definitions.
//  */

// export function getKlines(
//   symbol: string,
//   interval: string = "1",
//   limit: number = 500
// ) {
//   return apiGet<Kline[]>(
//     `/api/market/${symbol}/klines`,
//     {
//       interval,
//       limit
//     }
//   );
// }

// export function getFunding(
//   symbol: string,
//   limit: number = 100
// ) {
//   return apiGet<FundingRate[]>(
//     `/api/market/${symbol}/funding`,
//     { limit }
//   );
// }

// export function getOpenInterest(
//   symbol: string,
//   limit: number = 100
// ) {
//   return apiGet<OpenInterest[]>(
//     `/api/market/${symbol}/open-interest`,
//     { limit }
//   );
// }

// export function getLiquidations(
//   symbol: string,
//   limit: number = 100
// ) {
//   return apiGet<Liquidation[]>(
//     `/api/market/${symbol}/liquidations`,
//     { limit }
//   );
// }

// export function getTrades(
//   symbol: string,
//   limit: number = 100
// ) {
//   return apiGet<Trade[]>(
//     `/api/market/${symbol}/trades`,
//     { limit }
//   );
// }

// export function getOrderBook(
//   symbol: string,
//   limit: number = 50
// ) {
//   return apiGet<OrderBook>(
//     `/api/market/${symbol}/orderbook`,
//     { limit }
//   );
// }

