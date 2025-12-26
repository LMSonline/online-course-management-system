"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type SkillCard = {
  title: string;
  learners: string;   // ví dụ '8M+'
  image: string;      // 1200x900 gợi ý
  href: string;
  bg?: string;        // màu nền ảnh (optional)
};

const cards: SkillCard[] = [
  {
    title: "Data Science",
    learners: "8M+",
    image: "/images/skills/ex_1.png",
    href: "/explore?c=data-science",
    bg: "bg-[#0E1626]"
  },
  {
    title: "ChatGPT",
    learners: "5M+",
    image: "/images/skills/ex_2.png",
    href: "/explore?c=chatgpt",
    bg: "bg-[#0F77F2]"
  },
  {
    title: "Prompt Engineering",
    learners: "730k+",
    image: "/images/skills/ex_3.png",
    href: "/explore?c=prompt-engineering",
    bg: "bg-[#2AB87F]"
  },
  {
    title: "Software Engineering",
    learners: "730k+",
    image: "/images/skills/ex_4.png",
    href: "/explore?c=prompt-engineering",
    bg: "bg-[#2AB87F]"
  },
];

export default function FeaturedSkills() {
  const [index, setIndex] = useState(1); // card trung tâm
  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  // helper lấy thứ tự hiển thị 3 thẻ
  const order = [index, (index + 1) % cards.length, (index + 2) % cards.length];

  return (
    <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: heading */}
        <div className="lg:col-span-4">
          <br></br>
          <br></br>
          <h2 className="text-4xl md:text-4xl font-extrabold mb-3">
            Learn essential <br /> career and life skills
          </h2>
          <p className="mt-4 text-muted max-w-[46ch]">
            Build in-demand skills fast and advance your career in a changing job market.
          </p>
        </div>

        {/* RIGHT: cards + controls */}
        <div className="lg:col-span-8">
          <div className="relative">
            {/* slider rail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {order.map((idx) => {
                const c = cards[idx];
                return (
                  <ArticleCard key={c.title} {...c} />
                );
              })}
            </div>

            {/* arrows */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                aria-label="Previous"
                onClick={prev}
                className="btn-icon"
              >
                <ChevronLeft size={18} />
              </button>
              {/* dots */}
              <div className="flex items-center gap-3">
                {cards.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setIndex(i)}
                    role="button"
                    aria-label={`Slide ${i + 1}`}
                    className={cn(
                      "h-2 w-2 rounded-full cursor-pointer transition",
                      index === i
                        ? "bg-[color:var(--brand-primary)]"
                        : "bg-white/30"
                    )}
                  />
                ))}
              </div>
              <button
                aria-label="Next"
                onClick={next}
                className="btn-icon"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ title, learners, image, href, bg }: SkillCard) {
  return (
    <article className={cn(
      "relative overflow-hidden rounded-2xl border border-app",
      "shadow-[0_8px_40px_-12px_rgba(0,0,0,.35)]",
      bg || "bg-surface"
    )}>
      {/* image */}
      <div className="relative aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* info card (floating) */}
      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href={href}
          className="block rounded-xl bg-white text-slate-900 shadow-md transition hover:translate-y-[-1px]"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Users size={16} />
              <span>{learners}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{title}</h3>
              <span className="i-ch" />
            </div>
          </div>
        </Link>
      </div>

      {/* rounded corners highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    </article>
  );
}
