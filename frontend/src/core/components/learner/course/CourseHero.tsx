// src/components/learner/course/CourseHero.tsx
import { Star, Globe2, Users } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";
import { useCart } from "@/core/components/learner/cart/CartContext";
import dynamic from "next/dynamic";
import { useState } from "react";

type CourseHeroProps = {
  course: CourseDetail & {
    price?: number;
    oldPrice?: number;
    discountPercent?: number;
    currency?: string;
    thumbnailUrl?: string;
  };
};

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
  const { addCourse, isInCart } = useCart();
  const [showEnroll, setShowEnroll] = useState(false);
  const EnrollStepper = dynamic(() => import("../enroll/EnrollStepper"), { ssr: false });

  const {
    title,
    subtitle,
    rating,
    ratingCount,
    studentsCount,
    lastUpdated,
    language,
    subtitles,
    level,
    price,
    oldPrice,
    discountPercent,
    currency = "$",
    thumbnailUrl,
  } = course;

  // Fallback logic giống CourseCardMini
  const safeThumbnail = thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : "/images/lesson_thum.png";

  const added = isInCart(course.id);
  return (
    <section className="relative border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--brand-600)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 md:py-10">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,640px)_360px] lg:grid-cols-[minmax(0,720px)_420px]">
          {/* LEFT – VALUE */}
          <div className="flex flex-col justify-center min-w-0">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {title}
            </h1>

            {/* Accent underline */}
            <div className="mt-2 h-1 w-24 rounded-full bg-[var(--brand-500)]" />

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-sm md:text-base text-slate-300">
              {subtitle}
            </p>

            {/* Rating / students */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-300">
              <div className="inline-flex items-center gap-1.5">
                <span className="font-semibold text-amber-300">
                  {/* Star rating display logic */}
                  {typeof course.rating === "number"
                    ? '4.2'
                    : 'N/A'}
                </span>
                <Star className="h-4 w-4 text-amber-300" />
                <span className="text-slate-400">
                  (47 ratings)
                </span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                68 students
              </span>
            </div>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] md:text-xs text-slate-400">
              <span>Last updated {lastUpdated}</span>
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" />
                {language}
              </span>
              {subtitles && subtitles.length > 0 && (
                <span>Subtitles: {subtitles.join(", ")}</span>
              )}
            </div>

            {/* Level badge */}
            <div className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200">
              <Users className="h-4 w-4 text-[var(--brand-400)]" />
              <span className="font-medium">
                {level} • Project-based learning
              </span>
            </div>
          </div>

          {/* RIGHT – SELL CARD */}
          <aside className="w-full">
            <div className="sticky top-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              {/* Thumbnail */}
              <div className="relative h-40 lg:h-44 bg-slate-900">
                <img
                  src={safeThumbnail}
                  alt={title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              </div>

              {/* Pricing & CTA */}
              <div className="space-y-4 p-4 md:p-5">
                {/* Price */}
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {currency}
                    {price?.toLocaleString() ?? "--"}
                  </span>
                  {oldPrice && (
                    <span className="pb-1 text-sm text-slate-400 line-through">
                      {currency}
                      {oldPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="pb-1 text-sm font-semibold text-emerald-400">
                      {discountPercent}% off
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <button
                    className={`w-full rounded-xl py-3 text-sm font-semibold transition ${added ? "bg-emerald-700 text-white cursor-not-allowed" : "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"}`}
                    disabled={added}
                    onClick={() => {
                      if (!added) {
                        addCourse({
                          id: course.id,
                          title,
                          price: price ?? 0,
                          oldPrice,
                          discountPercent,
                          currency,
                          thumbnailUrl: safeThumbnail,
                          level,
                          rating,
                          studentsCount,
                        });
                      }
                    }}
                  >
                    {added ? "Added to cart" : "Add to cart"}
                  </button>
                  <button
                    className="w-full rounded-xl border border-white/20 bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    onClick={() => setShowEnroll(true)}
                  >
                    Enroll now
                  </button>
                </div>

                {/* Trust */}
                <p className="text-center text-[11px] text-slate-400">
                  30-day money-back guarantee · Lifetime access
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {/* ENROLL MODAL */}
      {showEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <EnrollStepper course={course} onClose={() => setShowEnroll(false)} />
        </div>
      )}
    </section>
  );
};

export default CourseHero;
