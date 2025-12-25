"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import type { CourseSummary } from "@/features/courses/types/catalog.types";
import { addToCart, isInCart } from "@/features/cart/services/cart.service";
import { useToastStore } from "@/lib/toast";
import { SafeImage } from "@/components/shared/SafeImage";
import { useRouter } from "next/navigation";

interface CourseHoverCardProps {
  course: CourseSummary;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export function CourseHoverCard({ course, isOpen, onClose, position }: CourseHoverCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setInCart(isInCart(course.id));
  }, [course.id]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (inCart) {
      router.push("/cart");
      return;
    }

    // Extract price from priceLabel (e.g., "₫2,239,000" -> 2239000)
    const priceMatch = course.priceLabel.match(/[\d,]+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, "")) : 0;

    addToCart({
      courseId: course.id,
      slug: course.id, // Use ID as slug fallback
      title: course.title,
      price,
      priceLabel: course.priceLabel,
      thumbColor: course.thumbColor,
      instructorName: course.instructor,
      rating: course.rating,
      ratingCount: course.ratingCount,
    });

    setInCart(true);
    useToastStore.getState().success("Added to cart!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={cardRef}
      className="fixed z-50 w-[360px] max-w-[90vw] rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          : undefined
      }
    >
      {/* Header */}
      <div className="relative">
        <div className={`h-32 w-full bg-gradient-to-br ${course.thumbColor}`}>
          <div className="absolute inset-0 bg-black/20" />
          {course.tag && (
            <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur">
              {course.tag}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 hover:bg-black/80 transition"
          aria-label="Close"
        >
          <X size={14} className="text-white" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 line-clamp-2">{course.title}</h3>
          <p className="mt-1 text-xs text-slate-400">{course.instructor}</p>
        </div>

        {/* Course info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span>{course.level}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{course.duration}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span>{course.lectures} lectures</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-lg font-bold text-slate-50">{course.priceLabel}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            {inCart ? "Go to cart" : "Add to cart"}
          </button>
          <button
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-slate-900/60 hover:bg-slate-800/60 transition"
            aria-label="Add to wishlist"
          >
            <Heart size={16} className="text-slate-300" />
          </button>
        </div>

        {/* View course link */}
        <Link
          href={`/learner/courses/${course.slug ?? course.id}`}
          onClick={onClose}
          className="block text-center text-sm text-[var(--brand-400)] hover:text-[var(--brand-300)] transition"
        >
          View course details
        </Link>
      </div>
    </div>
  );
}

