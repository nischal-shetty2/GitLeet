"use client";

import * as React from "react";
import { type ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force theme to be applied immediately on client-side to prevent color glitches
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Force Safari to use the correct background color
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      document.body.classList.add("safari");
      document.body.style.backgroundColor = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--background");
    }
  }, []);

  // This helps ensure hydration doesn't cause a flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
