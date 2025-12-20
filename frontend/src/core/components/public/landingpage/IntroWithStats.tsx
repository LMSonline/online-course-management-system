"use client";

import Image from "next/image";
import { motion, type Variants, type Transition } from "framer-motion";
import gsap from "gsap";
import React from "react";
import Link from "next/link";

const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutExpo } as Transition,
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo } as Transition,
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const BASE_BG = "rgba(255,255,255,0.02)";
const HOVER_BG = "rgba(255,255,255,0.08)";

function onEnter(e: React.MouseEvent<HTMLLIElement>) {
  const el = e.currentTarget;
  gsap.to(el, {
    backgroundColor: HOVER_BG,
    boxShadow: "0 10px 40px -10px rgba(255,255,255,0.15)",
    scale: 1.03,
    duration: 0.3,
    ease: "power2.out",
  });
}

function onLeave(e: React.MouseEvent<HTMLLIElement>) {
  const el = e.currentTarget;
  gsap.to(el, {
    backgroundColor: BASE_BG,
    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
    scale: 1,
    duration: 0.4,
    ease: "power2.inOut",
  });
}

export default function IntroWithStats() {
  const stats = [
    { value: "1.2M+", label: "Active learners" },
    { value: "12k+", label: "Expert instructors" },
    { value: "85k+", label: "Certificates issued" },
    { value: "320+", label: "Learning paths" },
  ];

  return (

    <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_40%_at_20%_0%,rgba(152,255,121,.08),transparent_60%),radial-gradient(50%_40%_at_100%_0%,rgba(152,255,121,.05),transparent_60%)]" />

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="md:col-start-2 md:col-span-6 lg:col-start-2 lg:col-span-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent"
          >
            Discover your limitless learning journey
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base md:text-lg text-muted-foreground/90 max-w-3xl lg:max-w-4xl"
          >
            Expand your skills, master new knowledge, and grow with thousands of
            high-quality courses — from programming and design to AI and
            leadership.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base md:text-lg text-muted-foreground/90 max-w-3xl lg:max-w-4xl"
          >
            Learn anytime, anywhere, with personalized paths and verified
            digital certificates.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base md:text-lg text-muted-foreground/90 max-w-3xl lg:max-w-4xl"
          >
            <span className="text-lime-400 font-semibold">
              Build your future with us, starting today.
            </span>
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-base md:text-lg text-muted-foreground/90 max-w-3xl lg:max-w-4xl">
            <Link
              href="/signup"
              className="inline-flex items-center px-6 py-3 text-base font-semibold rounded-xl
    bg-[var(--brand-primary)] text-black shadow-[0_4px_20px_rgba(101,216,48,0.4)]
    hover:shadow-[0_6px_25px_rgba(101,216,48,0.5)] hover:scale-[1.03]
    active:scale-[0.98] transition-all duration-300 ease-out"
            >
              Get Started for Free
            </Link>
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          className="md:col-start-9 md:col-span-3 lg:col-start-9 lg:col-span-3 w-full md:justify-self-end"
        >
          <div
            className="relative rounded-3xl border border-white/10 
              bg-gradient-to-br from-white/4 to-white/2
              shadow-[0_20px_60px_-20px_rgba(132,204,22,.15)]
              overflow-hidden p-4 max-w-sm md:w-[320px] lg:w-[360px]"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/20">
              <Image
                src="/images/brand/logo-lms-blank.png"
                alt="LMS brand logo"
                fill
                sizes="(max-width: 768px) 80vw, 360px"
                priority
                className="object-contain p-6 md:p-7 lg:p-8 rounded-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 h-px bg-white/5" />

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        aria-label="platform statistics"
      >
        {stats.map((s) => (
          <motion.li
            key={s.label}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            variants={fadeUp}
            style={{ backgroundColor: BASE_BG }}
            className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm 
             flex flex-col items-center justify-center text-center
             px-5 py-8 md:py-10 transition-transform duration-300 will-change-transform"
          >
            <div className="text-3xl md:text-4xl font-extrabold text-lime-400 leading-none">
              {s.value}
            </div>
            <div className="mt-2 text-sm md:text-base text-muted-foreground">
              {s.label}
            </div>
          </motion.li>

        ))}
      </motion.ul>
    </section>
  );
}
