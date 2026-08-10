
// frontend/hooks/useStrategies.ts

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  getStrategies,
  getStrategy,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  type CreateStrategyRequest
} from "@/lib/api/strategy";

export function useStrategies() {
  return useQuery({
    queryKey: [
      "strategies"
    ],

    queryFn: getStrategies
  });
}

export function useStrategy(
  id: string
) {
  return useQuery({
    queryKey: [
      "strategy",
      id
    ],

    queryFn: () =>
      getStrategy(id),

    enabled: Boolean(id)
  });
}

export function useCreateStrategy() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      request: CreateStrategyRequest
    ) =>
      createStrategy(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "strategies"
        ]
      });
    }
  });
}

export function useUpdateStrategy() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: Partial<CreateStrategyRequest>;
    }) =>
      updateStrategy(id, data),

    onSuccess: (
      _data,
      variables
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          "strategies"
        ]
      });

      queryClient.invalidateQueries({
        queryKey: [
          "strategy",
          variables.id
        ]
      });
    }
  });
}

export function useDeleteStrategy() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string
    ) =>
      deleteStrategy(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "strategies"
        ]
      });
    }
  });
}

