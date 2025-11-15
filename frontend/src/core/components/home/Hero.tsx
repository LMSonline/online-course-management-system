"use client";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import SearchBar from "@/core/components/ui/SearchBar";
import Button from "@/core/components/ui/Button";
import { usePrefersReducedMotion } from "@/core/components/hooks/UsePrefersReducedMotion";
import { useBump } from "@/core/components/hooks/UseBump";

/** Presentational Component (View) + Hook animation (Controller) */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();

  // intro animations (stagger mềm, tắt khi reduced-motion)
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from([".hero-title", ".hero-sub", ".hero-search", ".hero-cta"], {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  // bump logo bên phải
  useBump(logoRef, { scale: 1.06, duration: 1 });

  return (
    <section ref={rootRef} className="relative overflow-hidden">
      {/* wash gradient rất nhẹ ở top để mềm nền */}
      <div className="pointer-events-none absolute -inset-x-24 -top-24 h-60 
                      bg-[radial-gradient(60%_50%_at_50%_0%,rgba(22,163,74,0.12),transparent_60%)]" />

      <div className="container mx-auto px-4 py-14 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: copy + search + CTA (max width tránh dòng quá dài) */}
          <div className="lg:col-span-7 xl:col-span-7 max-w-[720px]">
            <h1
              className="hero-title font-extrabold leading-tight text-slate-900
                         text-[clamp(2rem,6vw,3.5rem)] tracking-tight"
            >
              Học mọi kỹ năng <span className="text-[var(--primary)]">nhanh hơn</span> với&nbsp;LMS
            </h1>

            <p className="hero-sub mt-3 text-lg text-slate-600 leading-relaxed">
              Giao diện sạch, dễ dùng, theo phong cách Udemy. Tìm kiếm dễ,
              lộ trình rõ ràng, hiệu ứng mượt mà với GSAP.
            </p>

            <div className="hero-search mt-6 max-w-2xl">
              <SearchBar />
              {/* gợi ý chips (onboarding) */}
              <div className="mt-3 flex flex-wrap gap-2">
                {["Next.js", "UI/UX", "IELTS", "Data Analysis"].map((t) => (
                  <a key={t}
                     href={`/explore?q=${encodeURIComponent(t)}`}
                     className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">
                    {t}
                  </a>
                ))}
              </div>
            </div>

            <div className="hero-cta mt-6 flex gap-3">
              <a href="/courses">
                <Button>
                  Bắt đầu học <ArrowRight size={16} />
                </Button>
              </a>
              <a href="#">
                <Button variant="outline">Xem lộ trình</Button>
              </a>
            </div>
          </div>

          {/* RIGHT: logo/illustration với hiệu ứng bump */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <Image
              ref={logoRef as any}
              src="/images/lms_logo.png"
              alt="LMS Logo"
              width={360}
              height={360}
              priority
              className="drop-shadow-[0_20px_40px_rgba(2,6,23,0.1)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
