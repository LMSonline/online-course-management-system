"use client";

import Image from "next/image";
import { Quote, ArrowRight } from "lucide-react";
import { motion, type Variants, type Transition } from "framer-motion";

export type Review = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;     // path to image (optional)
  ctaLabel?: string;   // e.g., "View this AWS course"
  ctaHref?: string;
  badge?: { img: string; label: string }; // e.g., StackOverflow logo + label
  meta?: string;       // e.g., "37,076 responses collected"
};

const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export default function ReviewCard({
  quote,
  author,
  role,
  company,
  avatar = "/images/avatars/avatar.jpg",
  ctaLabel = "Read full story",
  ctaHref = "#",
  badge,
  meta,
}: Review) {
  return (
    <motion.article
      variants={cardVariants}
      className="
        rounded-2xl border border-white/10 bg-secondary/40 backdrop-blur-sm
        p-6 md:p-7
      "
    >
      {/* quotation icon */}
      <Quote className="h-6 w-6 text-lime-400/80" />

      {/* quote text */}
      <p className="mt-5 text-[15px] md:text-base text-muted-foreground/90 max-w-[900px]">
        {quote}
      </p>

      {/* badge / source */}
      {badge && (
        <div className="mt-5 flex items-center gap-3">
          <Image src={badge.img} alt={badge.label} width={26} height={26} className="rounded" />
          <div className="text-sm text-muted-foreground">{meta}</div>
        </div>
      )}

      {/* author */}
      <div className="mt-5 flex items-center gap-3">
        <Image
          src={avatar}
          alt={author}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="text-sm">
          <div className="text-white font-medium">{author}</div>
          <div className="text-muted-foreground">
            {role}{company ? ` at ${company}` : ""}
          </div>
        </div>
      </div>

      {/* CTA */}
      <a
        href={ctaHref}
        className="
          mt-5 inline-flex items-center gap-1.5 text-sm font-medium
          text-lime-300 hover:text-lime-200 transition
        "
      >
        {ctaLabel} <ArrowRight className="h-4 w-4" />
      </a>
    </motion.article>
  );
}
