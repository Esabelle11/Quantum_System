
// frontend/stores/researchStore.ts

"use client";

import {
  create
} from "zustand";

type ResearchFeature =
  | "price"
  | "volatility"
  | "funding"
  | "oi"
  | "liquidation";

interface ResearchState {
  selectedFeature:
    | ResearchFeature
    | null;

  selectedFeatures:
    ResearchFeature[];

  hypothesis: string;

  startDate: string | null;

  endDate: string | null;

  setSelectedFeature: (
    feature: ResearchFeature | null
  ) => void;

  toggleFeature: (
    feature: ResearchFeature
  ) => void;

  setHypothesis: (
    hypothesis: string
  ) => void;

  setDateRange: (
    start: string | null,
    end: string | null
  ) => void;

  resetResearch: () => void;
}

export const useResearchStore =
  create<ResearchState>((set) => ({
    selectedFeature: null,

    selectedFeatures: [],

    hypothesis: "",

    startDate: null,

    endDate: null,

    setSelectedFeature: (
      feature
    ) =>
      set({
        selectedFeature: feature
      }),

    toggleFeature: (
      feature
    ) =>
      set((state) => {
        const exists =
          state.selectedFeatures.includes(
            feature
          );

        return {
          selectedFeatures: exists
            ? state.selectedFeatures.filter(
                (item) =>
                  item !== feature
              )
            : [
                ...state.selectedFeatures,
                feature
              ]
        };
      }),

    setHypothesis: (
      hypothesis
    ) =>
      set({
        hypothesis
      }),

    setDateRange: (
      start,
      end
    ) =>
      set({
        startDate: start,
        endDate: end
      }),

    resetResearch: () =>
      set({
        selectedFeature: null,
        selectedFeatures: [],
        hypothesis: "",
        startDate: null,
        endDate: null
      })
  }));



//   This will be useful once your analysis/ module becomes more complete.