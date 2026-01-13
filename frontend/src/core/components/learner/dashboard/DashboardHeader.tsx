"use client";

import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import type { MeUser } from "@/services/auth/auth.types";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// src/components/learner/dashboard/DashboardHeader.tsx
export function DashboardHeader() {
  const { user, isLoading } = useAuth() as {
    user: MeUser | null;
    isLoading: boolean;
  };
  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        relative mb-12
        overflow-hidden
        rounded-3xl
        border border-white/5
        bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(16,185,129,0.14),transparent_42%),radial-gradient(900px_circle_at_90%_20%,rgba(56,189,248,0.12),transparent_45%),linear-gradient(to_bottom,#020617,transparent)]
        px-8 py-10
      "
    >
      {/* Signature top glow */}
      <div
        aria-hidden
        className="
          absolute inset-x-8 top-0 h-px
          bg-gradient-to-r
          from-transparent
          via-emerald-400/60
          to-transparent
        "
      />

      {/* Badge */}
      <motion.p
        variants={itemVariants}
        className="
          inline-flex items-center gap-2
          rounded-full
          border border-emerald-400/20
          bg-emerald-400/10
          px-4 py-1.5
          text-[11px] font-semibold uppercase tracking-widest
          text-emerald-300
          shadow-[0_0_0_1px_rgba(16,185,129,0.15)]
        "
      >
        My learning
      </motion.p>

      {/* Title */}
      {isLoading ? (
        <motion.div
          variants={itemVariants}
          className="mt-6 h-12 w-72 rounded-md bg-slate-700/40"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      ) : (
        <motion.h1
          variants={itemVariants}
          className="
            mt-5
            text-4xl md:text-5xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          🔥 Welcome back,{" "}
          <span className="text-emerald-300">
            {user?.username ?? "Learner"}
          </span>{" "}!
        </motion.h1>
      )}

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="
    mt-4
    max-w-4xl lg:max-w-5xl
    text-base
    leading-relaxed
    text-slate-400
  "
      >
        Continue your learning journey with courses tailored to your goals.
        Pick up where you left off or discover something new today.
      </motion.p>

    </motion.header>
  );
}
