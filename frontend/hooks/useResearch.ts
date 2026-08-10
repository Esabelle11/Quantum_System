
// frontend/hooks/useResearch.ts

"use client";

import {
  useMutation,
  useQuery
} from "@tanstack/react-query";

import {
  getResearchReports,
  getResearchReport,
  runResearch,
  type ResearchRequest
} from "@/lib/api/research";

export function useResearchReports(
  symbol?: string
) {
  return useQuery({
    queryKey: [
      "research",
      "reports",
      symbol
    ],

    queryFn: () =>
      getResearchReports(symbol)
  });
}

export function useResearchReport(
  id: string
) {
  return useQuery({
    queryKey: [
      "research",
      "report",
      id
    ],

    queryFn: () =>
      getResearchReport(id),

    enabled: Boolean(id)
  });
}

export function useRunResearch() {
  return useMutation({
    mutationFn: (
      request: ResearchRequest
    ) => runResearch(request)
  });
}

// This gives your future Research page a nice pattern:
// useResearchReports()
// useResearchReport(id)
// useRunResearch()