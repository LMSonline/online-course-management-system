"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";


export function useGsapStagger(selector = ".stagger", delay = 0) {
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(selector, { opacity: 0, y: 8, duration: 0.6, stagger: 0.06, delay });
        });
        return () => ctx.revert();
    }, [selector, delay]);
}