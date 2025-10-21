"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";


export function useGsapFadeIn(selector = ".fade-in", delay = 0) {
useLayoutEffect(() => {
const ctx = gsap.context(() => {
gsap.from(selector, { opacity: 0, y: 10, duration: 0.8, stagger: 0.05, delay });
});
return () => ctx.revert();
}, [selector, delay]);
}