
// frontend/stores/uiStore.ts

"use client";

import {
  create
} from "zustand";

interface UIState {
  sidebarCollapsed: boolean;

  mobileMenuOpen: boolean;

  commandPaletteOpen: boolean;

  toggleSidebar: () => void;

  setSidebarCollapsed: (
    collapsed: boolean
  ) => void;

  setMobileMenuOpen: (
    open: boolean
  ) => void;

  setCommandPaletteOpen: (
    open: boolean
  ) => void;
}

export const useUIStore =
  create<UIState>((set) => ({
    sidebarCollapsed: false,

    mobileMenuOpen: false,

    commandPaletteOpen: false,

    toggleSidebar: () =>
      set((state) => ({
        sidebarCollapsed:
          !state.sidebarCollapsed
      })),

    setSidebarCollapsed: (
      collapsed
    ) =>
      set({
        sidebarCollapsed: collapsed
      }),

    setMobileMenuOpen: (
      open
    ) =>
      set({
        mobileMenuOpen: open
      }),

    setCommandPaletteOpen: (
      open
    ) =>
      set({
        commandPaletteOpen: open
      })
  }));

