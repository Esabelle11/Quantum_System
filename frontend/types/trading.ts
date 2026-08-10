
// frontend/types/trading.ts

/**
 * Trading environment.
 *
 * Paper should be the default during development.
 */
export type TradingMode =
  | "paper"
  | "live";

/**
 * Order side.
 */
export type OrderSide =
  | "Buy"
  | "Sell";

/**
 * Order type.
 */
export type OrderType =
  | "Market"
  | "Limit"
  | "Stop"
  | "StopLimit"
  | string;

/**
 * Order status.
 */
export type OrderStatus =
  | "New"
  | "PartiallyFilled"
  | "Filled"
  | "Cancelled"
  | "Rejected"
  | "Triggered"
  | string;

/**
 * Position.
 */
export interface Position {
  symbol: string;

  side:
    | "Buy"
    | "Sell"
    | "Long"
    | "Short"
    | string;

  size: number;

  entryPrice: number;

  markPrice?: number;

  liquidationPrice?: number;

  leverage?: number;

  unrealizedPnl?: number;

  realizedPnl?: number;

  margin?: number;
}

/**
 * Order.
 */
export interface Order {
  id: string;

  symbol: string;

  side: OrderSide;

  type: OrderType;

  quantity: number;

  filledQuantity?: number;

  price?: number;

  averagePrice?: number;

  status: OrderStatus;

  reduceOnly?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * Create order request.
 */
export interface CreateOrderRequest {
  symbol: string;

  side: OrderSide;

  type: OrderType;

  quantity: number;

  price?: number;

  leverage?: number;

  reduceOnly?: boolean;
}

/**
 * Portfolio summary.
 */
export interface PortfolioSummary {
  equity: number;

  balance: number;

  availableBalance?: number;

  unrealizedPnl?: number;

  realizedPnl?: number;

  marginUsed?: number;

  marginAvailable?: number;
}

/**
 * Risk status.
 */
export interface RiskStatus {
  allowed: boolean;

  reason?: string;

  exposure?: number;

  maxExposure?: number;

  drawdown?: number;

  maxDrawdown?: number;

  dailyLoss?: number;

  maxDailyLoss?: number;
}

/**
 * Trading account state.
 */
export interface TradingAccount {
  mode: TradingMode;

  portfolio?: PortfolioSummary;

  positions?: Position[];

  risk?: RiskStatus;
}

