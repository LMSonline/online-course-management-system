"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const categories = [
  { title: "Development", img: "/images/categories/dev.png", href: "/explore?c=dev" },
  { title: "Design", img: "/images/categories/design.png", href: "/explore?c=design" },
  { title: "Business", img: "/images/categories/business.png", href: "/explore?c=business" },
  { title: "AI & Data", img: "/images/categories/ai.png", href: "/explore?c=ai" },
];

export default function CategoryRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((c) => (
        <CategoryCard key={c.title} category={c} />
      ))}
    </div>
  );
}

function CategoryCard({ category }: { category: typeof categories[0] }) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(category.img);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc("/images/lesson_thum.png");
    }
  };

  return (
    <Link
      href={category.href}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
        "hover:bg-white/10 transition group"
      )}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={imgSrc}
          alt={category.title}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition"
          onError={handleError}
          unoptimized={imgError}
        />
      </div>

      <div className="absolute inset-x-3 bottom-3 text-white">
        <h3 className="font-semibold text-lg">{category.title}</h3>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    </Link>
  );
}
