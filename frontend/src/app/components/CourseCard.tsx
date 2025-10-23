"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export type Course = {
  id?: string;
  title: string;
  teacher: string;
  image: string;          // /public path or URL
  rating: number;         // 0..5
  ratingCount?: number;
  price: string;          // formatted
  originalPrice?: string;
  bestSeller?: boolean;
  href?: string;
  className?: string;
};

function Wrapper({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    // khác SkillCard: có VIỀN bao ngoài + nền sáng hơn + shadow
    "group block relative isolate rounded-2xl border bg-white/[0.06] dark:bg-white/[0.06] " +
    "border-white/20 hover:border-white/30 " +
    "shadow-[0_6px_20px_rgba(0,0,0,.18)] hover:shadow-[0_10px_28px_rgba(0,0,0,.24)] " +
    "transition-all overflow-visible";

  if (href) {
    return (
      <Link href={href} className={cn(base, className)}>
        {children}
      </Link>
    );
  }
  return <div className={cn(base, className)}>{children}</div>;
}

export default function CourseCard(props: Course) {
  const {
    title,
    teacher,
    image,
    rating,
    ratingCount,
    price,
    originalPrice,
    bestSeller,
    href,
    className,
  } = props;

  return (
    <Wrapper href={href} className={className}>
      {/* Media: chỉ overflow-hidden ở ảnh để không cắt panel/viền */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl rounded-b-none">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          priority={false}
        />
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug">
          {title}
        </h3>
        <div className="mt-1 text-[13px] text-muted-foreground">{teacher}</div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5 text-[13px]">
          <Star className="h-[14px] w-[14px] fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{rating.toFixed(1)}</span>
          {typeof ratingCount === "number" && (
            <span className="text-muted-foreground">
              ({ratingCount.toLocaleString()})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <div className="text-[16px] font-bold">{price}</div>
          {originalPrice && (
            <div className="text-[13px] text-muted-foreground line-through">
              {originalPrice}
            </div>
          )}
        </div>

        {/* Badge */}
        {bestSeller && (
          <div className="mt-2 inline-flex rounded-md bg-lime-400/15 px-2 py-1 text-[11px] font-semibold text-lime-300">
            Bestseller
          </div>
        )}
      </div>

      {/* subtle focus/hover ring (không đẩy layout) */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-white/20 transition" />
    </Wrapper>
  );
}
