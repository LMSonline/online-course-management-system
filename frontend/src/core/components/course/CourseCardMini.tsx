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
    className,
    category,
  } = props;

  // Fallback logic for image
  const safeImage = image && image.trim() !== "" ? image : "/images/lesson_thum.png";

  return (
    <Link
      href={href || "#"}
      className={cn(
        "group relative aspect-square w-full rounded-2xl border border-white/10 bg-slate-950/80 overflow-hidden hover:border-[var(--brand-500)]/70 hover:shadow-[0_0_40px_rgba(22,163,74,0.35)] transition",
        className
      )}
    >
      {/* Background image fills the card */}
      <SafeImage
        src={safeImage}
        alt={title}
        fallback="/images/lesson_thum.png"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
        priority={false}
      />
      {/* Overlay for darken effect */}
      <div className="absolute inset-0 bg-black/20" />
      {/* Category badge if present */}
      {category && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-slate-100 backdrop-blur">
          {category}
        </div>
      )}
      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <h3 className="text-sm md:text-[15px] font-semibold leading-snug line-clamp-2 text-white">{title}</h3>
        <p className="mt-1 text-xs text-slate-200">{teacher}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-200">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-300" />
            {rating.toFixed(1)}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span className="font-bold text-[13px] text-white">{price}</span>
        </div>
      </div>
    </Link>
  );
}
