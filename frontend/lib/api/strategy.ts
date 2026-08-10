
// frontend/lib/api/strategy.ts

/**
 * Strategy API layer.
 *
 * Backend:
 *
 * app/strategy/
 * ├── signal.py
 * └── regime.py
 */

// TODO:
// getStrategies()
// getStrategy()
// createStrategy()
// updateStrategy()
// deleteStrategy()
// getSignals()
// getRegime()

export {};




// frontend/lib/api/strategy.ts

import {
    apiDelete,
    apiGet,
    apiPost,
    apiPut
  } from "./client";
  
  export interface Strategy {
    id: string;
    name: string;
    description?: string;
  
    enabled?: boolean;
  
    parameters?: Record<
      string,
      string | number | boolean
    >;
  
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CreateStrategyRequest {
    name: string;
    description?: string;
  
    parameters?: Record<
      string,
      string | number | boolean
    >;
  }
  
  export function getStrategies() {
    return apiGet<Strategy[]>(
      "/api/strategies"
    );
  }
  
  export function getStrategy(
    id: string
  ) {
    return apiGet<Strategy>(
      `/api/strategies/${id}`
    );
  }
  
  export function createStrategy(
    request: CreateStrategyRequest
  ) {
    return apiPost<Strategy>(
      "/api/strategies",
      request
    );
  }
  
  export function updateStrategy(
    id: string,
    request: Partial<CreateStrategyRequest>
  ) {
    return apiPut<Strategy>(
      `/api/strategies/${id}`,
      request
    );
  }
  
  export function deleteStrategy(
    id: string
  ) {
    return apiDelete<void>(
      `/api/strategies/${id}`
    );
  }
  
  