"use client";

import { useEffect } from "react";

/*
 * Hold the page still while a modal is open.
 *
 * Without this, a wheel gesture that misses the panel scrolls the list behind
 * it — so you close the dialog and find yourself somewhere else on the page.
 * The scrollbar is replaced with padding of the same width so the layout
 * doesn't jump sideways as it disappears.
 */
export function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [active]);
}
