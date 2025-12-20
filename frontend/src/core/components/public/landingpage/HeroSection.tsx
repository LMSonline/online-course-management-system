"use client";
import { useSplashRedirect } from "@/core/components/hooks/UseSplashRedirect";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

export default function HeroSection() {
  const logoRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useSplashRedirect(3000, "/explore");

  useEffect(() => {
    gsap.set([titleRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 18 });
    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.8 } });
    tl.fromTo(logoRef.current, { opacity: 0, scale: 0.88, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.9 })
      .to(titleRef.current, { opacity: 1, y: 0 }, "-=0.1")
      .to(subRef.current, { opacity: 1, y: 0 }, "-=0.2")
      .to(ctaRef.current, { opacity: 1, y: 0, scale: 1 }, "-=0.2");
    gsap.to(logoRef.current, { y: -6, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true });
  }, []);

  return (
  <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
      <Image
        ref={logoRef as any}
        src="/images/lms_logo.png"
        alt="LMS Logo"
        width={220}
        height={220}
        priority
        sizes="(max-width: 768px) 160px, 220px"
      />

      <h1
        ref={titleRef}
        className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900"
      >
        LMS
      </h1>

      <p
        ref={subRef}
        className="mt-3 text-green-600 text-base sm:text-lg"
      >
        Learning Manager System Online
      </p>

      
        
    </section>
  );
}
