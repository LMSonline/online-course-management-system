"use client";

// src/components/learner/catalog/CourseCard.tsx
import { useState, useRef } from "react";
import { Star } from "lucide-react";
import type { CourseSummary } from "@/lib/learner/catalog/types";
import { CourseHoverCard } from "@/features/courses/components/CourseHoverCard";
import { addToCart, isInCart } from "@/features/cart/services/cart.service";
import { useToastStore } from "@/lib/toast";
import { useRouter } from "next/navigation";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

interface CourseCardProps {
  course: CourseSummary;
  showHoverCard?: boolean; // Enable hover card on desktop
}

export function CourseCard({ course, showHoverCard = true }: CourseCardProps) {
  const router = useRouter();
  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | undefined>();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!showHoverCard) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setHoverPosition({
        x: rect.right + 16,
        y: rect.top,
      });
      setHoverOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!showHoverCard) return;
    // Delay to allow moving to hover card
    setTimeout(() => {
      setHoverOpen(false);
    }, 200);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInCart(course.id)) {
      router.push("/cart");
      return;
    }

    const priceMatch = course.priceLabel.match(/[\d,]+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, "")) : 0;

    addToCart({
      courseId: course.id,
      slug: course.id,
      title: course.title,
      price,
      priceLabel: course.priceLabel,
      thumbColor: course.thumbColor,
      instructorName: course.instructor,
      rating: course.rating,
      ratingCount: course.ratingCount,
    });

    useToastStore.getState().success("Added to cart!");
  };

  return (
    <>
      <article
        ref={cardRef}
        className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 hover:border-[var(--brand-500)]/70 hover:shadow-[0_0_32px_rgba(34,197,94,0.4)] transition relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {/* thumbnail */}
      <div
        className={`relative h-32 md:h-36 w-full bg-gradient-to-br ${course.thumbColor}`}
      >
        <div className="absolute inset-0 bg-black/15" />
        {course.tag && (
          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur">
            {course.tag}
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <h3 className="line-clamp-2 text-sm md:text-[15px] font-semibold group-hover:text-[var(--brand-100)]">
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-slate-400">{course.instructor}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-300" />
            <span className="font-semibold text-amber-300">
              {course.rating.toFixed(1)}
            </span>
            <span className="text-slate-400">
              ({formatNumber(course.ratingCount)})
            </span>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{formatNumber(course.students)} students</span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
          <span>{course.level}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{course.duration}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{course.lectures} lectures</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-50">
            {course.priceLabel}
          </span>
          <button
            onClick={handleAddToCartClick}
            className="text-[11px] font-medium text-[var(--brand-300)] hover:text-[var(--brand-100)] transition"
          >
            {isInCart(course.id) ? "In cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>

    {/* Hover card (desktop only) */}
    {showHoverCard && hoverOpen && (
      <CourseHoverCard
        course={course}
        isOpen={hoverOpen}
        onClose={() => setHoverOpen(false)}
        position={hoverPosition}
      />
    )}
    </>
  );
}
