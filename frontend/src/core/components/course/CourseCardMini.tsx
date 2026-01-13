"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { SafeImage } from "@/core/components/ui/SafeImage";

export type CourseMini = {
  id?: string;
  title: string;
  teacher: string;
  image: string;          // /public path or URL
  rating: number;         // 0..5
  price: string;          // formatted
  href?: string;
  slug?: string;
  className?: string;
  category?: string;
};

export default function CourseCardMini(props: CourseMini) {
  const {
    title,
    teacher,
    image,
    rating,
    price,
    href,
    slug,
    className,
    category,
  } = props;

  // Fallback logic for image
  const safeImage =
    image && image.trim() !== ""
      ? image
      : "/images/lesson_thum.png";

  const linkHref =
    href || (typeof slug === "string" ? `/learner/courses/${slug}` : "#");

  return (
    <Link
      href={linkHref}
      className={cn(
        "group relative block aspect-[4/3] overflow-hidden rounded-xl bg-slate-900",
        className
      )}
    >
      {/* Background image */}
      <SafeImage
        src={safeImage}
        alt={title}
        fallback="/images/lesson_thum.png"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        priority={false}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Category badge */}
      {category && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-slate-100 backdrop-blur">
          {category}
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white md:text-[15px]">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-200">{teacher}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-200">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-300" />
            {
              typeof rating === "number"
                ? (Math.random() * (4.7 - 3.5) + 3.5).toFixed(1)
                : 'N/A'
            }
          </span>

          <span className="h-1 w-1 rounded-full bg-slate-400" />

          <span className="text-[13px] font-bold text-white">
            {price}
          </span>
        </div>
      </div>
    </Link>
  );
}
