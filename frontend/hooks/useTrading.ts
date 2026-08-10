
// frontend/hooks/useTrading.ts

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  getPositions,
  getOrders,
  createOrder,
  cancelOrder,
  type CreateOrderRequest
} from "@/lib/api/trading";

export function usePositions(
  enabled = true
) {
  return useQuery({
    queryKey: [
      "trading",
      "positions"
    ],

    queryFn: getPositions,

    enabled,

    refetchInterval: 5_000
  });
}

export function useOrders(
  enabled = true
) {
  return useQuery({
    queryKey: [
      "trading",
      "orders"
    ],

    queryFn: getOrders,

    enabled,

    refetchInterval: 5_000
  });
}

export function useCreateOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      request: CreateOrderRequest
    ) =>
      createOrder(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "trading",
          "positions"
        ]
      });

      queryClient.invalidateQueries({
        queryKey: [
          "trading",
          "orders"
        ]
      });
    }
  });
}

export function useCancelOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      orderId: string
    ) =>
      cancelOrder(orderId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "trading",
          "orders"
        ]
      });

      queryClient.invalidateQueries({
        queryKey: [
          "trading",
          "positions"
        ]
      });
    }
  });
}


// Your backend currently has:
// execution/
// ├── executor.py
// └── risk_manager.py
// but your main.py doesn't expose trading endpoints yet.
// So the frontend hook structure can be prepared, but don't expect it to work until those API routes exist.
