"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { CourseResponse } from "@/services/courses/course.types";
import { cn } from "@/lib/cn";
import { SafeImage } from "@/core/components/ui/SafeImage";

/**
 * Adapter to convert CourseResponse to CourseCard props and render
 * Maps API response to UI component props
 */
interface CourseCardAdapterProps {
  course: CourseResponse;
  className?: string;
}

export function CourseCardAdapter({ course, className }: CourseCardAdapterProps) {
  // Format price (assuming price comes from course version, may need adjustment)
  const price = "₫0"; // TODO: Get from course version when available
  const discountPrice = undefined; // TODO: Get from course version when available
  
  // Get rating (may need to fetch separately or from course version)
  const rating = 0; // TODO: Get from course reviews/rating summary
  const ratingCount = 0; // TODO: Get from course reviews/rating summary

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group block relative isolate rounded-2xl border bg-white/[0.06] dark:bg-white/[0.06] " +
        "border-white/20 hover:border-white/30 " +
        "shadow-[0_6px_20px_rgba(0,0,0,.18)] hover:shadow-[0_10px_28px_rgba(0,0,0,.24)] " +
        "transition-all overflow-visible",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl rounded-b-none">
        <SafeImage
          src={course.thumbnailUrl}
          alt={course.title}
          fallback="/images/lesson_thum.png"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
          priority={false}
          objectFit="cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug">
          {course.title}
        </h3>
        <div className="mt-1 text-[13px] text-muted-foreground">
          {course.teacherName || "Instructor"}
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-[13px]">
            <Star className="h-[14px] w-[14px] fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            {ratingCount > 0 && (
              <span className="text-muted-foreground">
                ({ratingCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <div className="text-[16px] font-bold">{price}</div>
          {discountPrice && (
            <div className="text-[13px] text-muted-foreground line-through">
              {discountPrice}
            </div>
          )}
        </div>
      </div>

      {/* Subtle focus/hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-white/20 transition" />
    </Link>
  );
}

