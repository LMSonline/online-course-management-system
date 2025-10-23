"use client";

import { motion, type Transition } from "framer-motion";
import type { ElementType } from "react";

const easeExpo: Transition["ease"] = [0.16, 1, 0.3, 1] as const;

export type TopicCardProps = {
  title: string;
  href: string;
  Icon: ElementType;
  description?: string;
};

export default function TopicCard({ title, href, Icon, description }: TopicCardProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: easeExpo }}
      className="
        group rounded-2xl border border-white/10
        bg-secondary/40 backdrop-blur-sm
        p-5 md:p-6
        shadow-[0_0_0_0_rgba(0,0,0,0)]
        hover:shadow-[0_12px_40px_-12px_rgba(132,204,22,.18)]
        transition
      "
    >
      <div className="flex items-center justify-between max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-semibold text-base md:text-lg">{title}</h3>
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted-foreground bg-white/5 group-hover:border-lime-300/30 group-hover:text-lime-300 transition">
          Explore
        </span>
      </div>

      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </motion.a>
  );
}
