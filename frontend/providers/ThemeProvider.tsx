
// frontend/providers/ThemeProvider.tsx

"use client";

import {
  ThemeProvider as NextThemesProvider
} from "next-themes";

import type {
  ReactNode
} from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({
  children
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}



// If you're using next-themes, this is straightforward.
// Install:
// npm install next-themes
