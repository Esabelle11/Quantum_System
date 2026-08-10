
// frontend/types/market.ts

/**
 * Supported market symbols.
 *
 * Currently the system is focused on BTCUSDT.
 * More symbols can be added later.
 */
export type MarketSymbol =
  | "BTCUSDT"
  | (string & {});

/**
 * Common market timeframe.
 */
export type Timeframe =
  | "1"
  | "3"
  | "5"
  | "15"
  | "30"
  | "60"
  | "120"
  | "240"
  | "360"
  | "720"
  | "D"
  | "W";

/**
 * Current market price.
 *
 * Backend:
 * GET /api/market/btcusdt
 */
export interface MarketTicker {
  symbol: string;
  price: number;
}

/**
 * OHLCV candle.
 */
export interface Kline {
  timestamp: number;

  open: number;
  high: number;
  low: number;
  close: number;

  volume: number;

  turnover?: number;
}

/**
 * Backend response for:
 *
 * GET /api/market/btcusdt/klines
 */
export interface KlineResponse {
  symbol: string;
  count: number;
  data: Kline[];
}

/**
 * Funding rate observation.
 */
export interface FundingRate {
  timestamp: number;
  symbol: string;

  fundingRate: number;

  nextFundingTime?: number;
}

/**
 * Open interest observation.
 */
export interface OpenInterest {
  timestamp: number;
  symbol: string;

  openInterest: number;

  openInterestValue?: number;
}

/**
 * Liquidation event.
 */
export interface Liquidation {
  timestamp: number;

  symbol: string;

  side: "Buy" | "Sell" | string;

  price: number;
  quantity: number;

  value?: number;
}

/**
 * Trade event.
 */
export interface Trade {
  timestamp: number;

  symbol: string;

  side: "Buy" | "Sell" | string;

  price: number;
  quantity: number;

  tradeId?: string;
}

/**
 * Order book level.
 */
export interface OrderBookLevel {
  price: number;
  quantity: number;
}

/**
 * Order book snapshot.
 */
export interface OrderBook {
  timestamp: number;

  symbol?: string;

  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

/**
 * Generic time-series point.
 *
 * Useful for charts and feature visualizations.
 */
export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

/**
 * Market data range.
 */
export interface MarketDataRange {
  start?: string;
  end?: string;
  interval?: Timeframe;
}

