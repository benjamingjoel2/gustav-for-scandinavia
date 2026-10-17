"use client";

import { useEffect, useRef } from "react";

/**
 * Apply the page's query string once, after hydration. Pages stay static (no Suspense bail-out, no layout shift)
 * and only shared or pre-filled links pay for a re-render.
 */
export function useInitialUrlParams(apply: (params: URLSearchParams) => void) {
  const applied = useRef(false);
  const latest = useRef(apply);
  useEffect(() => {
    latest.current = apply;
  });
  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    const params = new URLSearchParams(window.location.search);
    if (params.size) latest.current(params);
  }, []);
}
