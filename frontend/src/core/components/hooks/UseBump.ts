"use client";
import { RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "./UsePrefersReducedMotion";

/** Bump animation – generic để nhận mọi HTMLElement (img, div, ...). */
export function useBump<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opts: { scale?: number; duration?: number } = {}
) {
  const { scale = 1.06, duration = 1 } = opts;
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        scale,
        duration,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
    return () => ctx.revert();
  }, [ref, scale, duration, reduced]);
}
