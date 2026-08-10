
// frontend/lib/api/trading.ts

/**
 * Trading / execution API layer.
 *
 * Backend:
 *
 * app/execution/
 * ├── executor.py
 * └── risk_manager.py
 */

// TODO:
// getPositions()
// getOrders()
// createOrder()
// cancelOrder()
// getRiskStatus()
// getExecutionStatus()

export {};




// frontend/lib/api/trading.ts

import {
    apiGet,
    apiPost
  } from "./client";
  
  export interface Position {
    symbol: string;
    side: "Buy" | "Sell" | "Long" | "Short" | string;
  
    size: number;
    entryPrice: number;
    markPrice?: number;
  
    unrealizedPnl?: number;
    realizedPnl?: number;
  
    leverage?: number;
  }
  
  export interface Order {
    id: string;
    symbol: string;
  
    side: "Buy" | "Sell" | string;
    type: string;
  
    quantity: number;
    price?: number;
  
    status: string;
  
    createdAt?: string;
  }
  
  export interface CreateOrderRequest {
    symbol: string;
    side: "Buy" | "Sell";
    type: string;
  
    quantity: number;
    price?: number;
  
    leverage?: number;
  }
  
  export function getPositions() {
    return apiGet<Position[]>(
      "/api/trading/positions"
    );
  }
  
  export function getOrders() {
    return apiGet<Order[]>(
      "/api/trading/orders"
    );
  }
  
  export function createOrder(
    request: CreateOrderRequest
  ) {
    return apiPost<Order>(
      "/api/trading/orders",
      request
    );
  }
  
  export function cancelOrder(
    orderId: string
  ) {
    return apiPost<Order>(
      `/api/trading/orders/${orderId}/cancel`
    );
  }
  