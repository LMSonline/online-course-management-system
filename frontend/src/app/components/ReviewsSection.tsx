"use client";

import { motion } from "framer-motion";
import ReviewCard, { type Review } from "./ReviewCard";

const reviews: Review[] = [
  {
    quote:
      "Our platform was rated the most popular place to learn coding by the developer community — clear content, real projects, and practical paths.",
    author: "StackOverflow Community",
    role: "Independent survey",
    avatar: "/images/avatars/brand-stack.png", // optional logo-like avatar
    badge: { img: "/images/avatars/brand-stack.png", label: "StackOverflow" },
    meta: "37,076 responses collected",
    ctaLabel: "View Web Development courses",
    ctaHref: "/explore?q=Web%20Development",
  },
  {
    quote:
      "It was a complete game-changer and a practical guide as we brought our product to life.",
    author: "Alvin Lim",
    role: "Technical Co-Founder, CTO",
    company: "Dimensional",
    avatar: "/images/avatars/avatar.png",
    ctaLabel: "View this iOS & Swift course",
    ctaHref: "/explore?q=iOS%20Swift",
  },
  {
    quote:
      "I learned exactly what I needed for real-world work. It helped me land a new role.",
    author: "William A. Wachlin",
    role: "Partner Account Manager",
    company: "Amazon Web Services",
    avatar: "/images/avatars/avatar.png",
    ctaLabel: "View this AWS course",
    ctaHref: "/explore?q=AWS",
  },
  {
    quote:
      "Employees bridged technology and consulting soft skills — helping drive their careers forward.",
    author: "Ian Stevens",
    role: "Head of Capability Development",
    company: "Publicis Sapient (North America)",
    avatar: "/images/avatars/avatar.png",
    ctaLabel: "Read full story",
    ctaHref: "/stories/ian-stevens",
  },
];

export default function ReviewsSection() {
  return (
    <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-[28px] md:text-[36px] font-extrabold leading-tight tracking-tight max-w-[1100px]">
          Join others transforming their lives through learning
        </h2>
        <a
          href="/stories"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-lime-300 hover:border-lime-300/30 hover:bg-lime-400/5 transition-all"
        >
          View all stories
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {reviews.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </motion.div>
    </section>
  );
}
