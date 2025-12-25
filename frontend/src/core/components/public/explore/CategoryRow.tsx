"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { SafeImage } from "@/components/shared/SafeImage";

const categories = [
  { title: "Development", img: "/images/lesson_thum.png", href: "/explore?c=dev" },
  { title: "Design", img: "/images/lesson_thum.png", href: "/explore?c=design" },
  { title: "Business", img: "/images/lesson_thum.png", href: "/explore?c=business" },
  { title: "AI & Data", img: "/images/lesson_thum.png", href: "/explore?c=ai" },
];

export default function CategoryRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((c) => (
        <Link
          key={c.title}
          href={c.href}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
            "hover:bg-white/10 transition group"
          )}
        >
          <div className="relative aspect-[4/3]">
            <SafeImage
              src={c.img}
              alt={c.title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition"
            />
          </div>

          <div className="absolute inset-x-3 bottom-3 text-white">
            <h3 className="font-semibold text-lg">{c.title}</h3>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        </Link>
      ))}
    </div>
  );
}
