// components/shared/HydrationWrapper.tsx
"use client";

/* Prevents rendering of children until the app is hydrated (i.e., mounted in the browser).
    •Ensures consistency between server-rendered and client-rendered content. */

import { useState, useEffect } from "react";

type HydrationWrapperProps = {
  children: React.ReactNode;
};

export default function HydrationWrapper({ children }: HydrationWrapperProps) {
  // Track hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Once component mounts on the client, mark as hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Only render children after hydration to prevent mismatch
  return isHydrated ? <>{children}</> : null;
}