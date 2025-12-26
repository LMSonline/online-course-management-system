"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/core/components/ui/Button";
import { cn } from "@/lib/cn";

export type BannerSlide = {
  title: string;
  subtitle: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image: string; // path trong /public
};

export default function BannerCarousel({
  slides,
  autoPlayMs = 6000,
}: { slides: BannerSlide[]; autoPlayMs?: number }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const go = useCallback((to: number) => {
    const n = slides.length;
    const next = (to + n) % n;
    setIndex(next);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${next * 100}%)`;
    }
  }, [slides.length]);

  useEffect(() => {
    if (autoPlayMs > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => go(index + 1), autoPlayMs);
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }
  }, [index, go, autoPlayMs]);

  return (
    <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
      <div className="relative overflow-hidden rounded-xl bg-white">
        {/* Track (mỗi slide chiếm 100%) */}
        <div
          ref={trackRef}
          className="flex transition-transform duration-500"
          style={{ width: `${slides.length * 100}%` }}
        >
          {slides.map((s, i) => (
            <article key={i} className="w-full shrink-0">
              {/* Slide = background image + overlay + card trái */}
              <div className="relative h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px]">
                {/* Background image */}
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover"
                />
                {/* Overlay nhẹ để card nổi bật hơn */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.48)_40%,rgba(255,255,255,0)_70%)]" />

                {/* Card trái (giống Udemy) */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="h-full flex items-center">
                    <div className="pointer-events-auto">
                      <div className="m-6 sm:ml-14 md:ml-20 bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-6 sm:p-7 shadow-sm max-w-[560px]">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                          {s.title}
                        </h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">{s.subtitle}</p>
                        <div className="mt-5 flex gap-3">
                          {s.ctaPrimary && (
                            <a href={s.ctaPrimary.href}>
                              <Button>{s.ctaPrimary.label}</Button>
                            </a>
                          )}
                          {s.ctaSecondary && (
                            <a href={s.ctaSecondary.href}>
                              <Button variant="outline">{s.ctaSecondary.label}</Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Arrows */}
        <button
          aria-label="Previous"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center size-10 rounded-full
                     bg-white shadow border border-slate-200 hover:bg-slate-100"
        >
          <ChevronLeft />
        </button>
        <button
          aria-label="Next"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center size-10 rounded-full
                     bg-white shadow border border-slate-200 hover:bg-slate-100"
        >
          <ChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "size-2.5 rounded-full transition",
                i === index ? "bg-[var(--primary)]" : "bg-slate-300"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
