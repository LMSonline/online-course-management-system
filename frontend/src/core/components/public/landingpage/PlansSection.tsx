"use client";

import { CheckCircle2, Users, Building2, Sparkles } from "lucide-react";

type Feature = string;

type Plan = {
  key: string;
  title: string;
  subtitle: string;
  price?: string;
  priceNote?: string;
  ctaLabel: string;
  ctaHref: string;
  bullets: Feature[];
  extra?: {
    title: string;
    items: { heading: string; copy: string }[];
  };
};

const PLANS: Plan[] = [
  {
    key: "team",
    title: "Team Plan",
    subtitle: "2 to 11 people – For your team",
    price: "₫750,000 a month per user",
    priceNote: "Billed annually. Cancel anytime.",
    ctaLabel: "Try it free",
    ctaHref: "/teams",
    bullets: [
      "Access to 13,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coaching",
      "Analytics and adoption reports",
    ],
  },
  {
    key: "enterprise",
    title: "Enterprise Plan",
    subtitle: "More than 20 people – For your whole organization",
    ctaLabel: "Request a demo",
    ctaHref: "/enterprise",
    bullets: [
      "Access to 30,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coaching",
      "Advanced analytics and insights",
      "Dedicated customer success team",
      "International course collection (15+ languages)",
      "Customizable content",
      "Hands-on tech training add-ons",
      "Strategic implementation services add-ons",
    ],
  },
  {
    key: "ai-fluency",
    title: "AI Fluency",
    subtitle: "From AI foundations to Enterprise transformation",
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
    bullets: [],
    extra: {
      title: "",
      items: [
        {
          heading: "AI Readiness Collection",
          copy:
            "Build org-wide AI fluency fast with 50 curated courses + AI Assistant to accelerate learning.",
        },
        {
          heading: "AI Growth Collection",
          copy:
            "Scale AI & technical expertise with 800+ specialized courses and 30+ role-specific learning paths in multiple languages.",
        },
      ],
    },
  },
];

/* ------------ CTA variants (tất cả dùng tông xanh) ------------- */
const ctaBase =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#65D830]/40";

const CTA = {
  filled:
    "bg-[#65D830] text-black shadow-[0_6px_22px_rgba(101,216,48,.30)] hover:shadow-[0_8px_28px_rgba(101,216,48,.42)] hover:scale-[1.02] active:scale-[0.98]",
  outline:
    "text-[#65D830] border border-[#65D830]/50 hover:border-[#65D830] hover:bg-[#65D830]/10",
  soft:
    "bg-white/10 text-white hover:bg-white/20 border border-white/10",
};

/* ------------ Plan Card ------------- */
function PlanCard({ plan, variant }: { plan: Plan; variant: "filled" | "outline" | "soft" }) {
  // accent đều màu xanh
  const accentBar = "from-[#65D830] to-[#A8F07A]";

  return (
    <div
      className="
        h-full relative rounded-2xl border border-white/10 bg-white/5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        hover:shadow-[0_10px_30px_rgba(0,0,0,.18)]
        transition-all
      "
    >
      {/* accent bar xanh */}
      <div className={`absolute left-0 right-0 top-0 h-[6px] rounded-t-2xl bg-gradient-to-r ${accentBar}`} />

      <div className="p-6 md:p-7 flex flex-col">
        {/* header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {plan.key === "team" && <Users className="h-4 w-4" />}
            {plan.key === "enterprise" && <Building2 className="h-4 w-4" />}
            {plan.key === "ai-fluency" && <Sparkles className="h-4 w-4" />}
            <span>{plan.subtitle}</span>
          </div>
          <h3 className="mt-1 text-2xl font-bold">{plan.title}</h3>
        </div>

        {/* price */}
        {plan.price && (
          <div className="mb-5">
            <div className="text-lg font-semibold">{plan.price}</div>
            {plan.priceNote && (
              <div className="text-sm text-muted-foreground">{plan.priceNote}</div>
            )}
          </div>
        )}

        {/* bullets / extra */}
        <div className="flex-1">
          {plan.bullets.length > 0 ? (
            <ul className="space-y-2.5">
              {plan.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#65D830]" />
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          ) : plan.extra ? (
            <div className="space-y-6">
              {plan.extra.items.map((x, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{i === 0 ? "More than 100 people" : "More than 20 people"}</span>
                  </div>
                  <h4 className="font-semibold">{x.heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{x.copy}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <a href={plan.ctaHref} className={`${ctaBase} ${CTA[variant]}`}>
            {plan.ctaLabel}
          </a>
        </div>
      </div>

      {/* ring xanh subtle */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 hover:ring-2 ring-[#65D830]/40 transition-all" />
    </div>
  );
}

/* ------------ Section ------------- */
export default function PlansSection() {
  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 md:px-10 xl:px-16">
      <header className="mb-6 md:mb-8">
        <h2 className="text-[28px] md:text-[36px] font-extrabold leading-tight tracking-tight max-w-[1100px]">
          Grow your team&apos;s skills and your business
        </h2>
        <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">
          Reach goals faster with one of our plans or programs. Try one free today or contact sales to learn more.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {/* 3 biến thể CTA: filled / outline / soft */}
        <PlanCard plan={PLANS[0]} variant="filled" />
        <PlanCard plan={PLANS[1]} variant="outline" />
        <PlanCard plan={PLANS[2]} variant="soft" />
      </div>
    </section>
  );
}
