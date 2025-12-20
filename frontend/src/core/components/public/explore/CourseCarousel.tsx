"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "@/core/components/course/CourseCard";

const mockCourses = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Popular Course #${i + 1}`,
  teacher: "John Doe",
  image: "/images/lesson_thum.png",
  rating: 4.4,
  ratingCount: 2400 + i * 12,
  price: "₫199,000",
  originalPrice: i % 3 === 0 ? "₫399,000" : undefined,
  bestSeller: i % 4 === 0,
  href: `/courses/${i + 1}`,
}));

function usePerView() {
  const [pv, setPv] = useState(1);

  useEffect(() => {
    const md = matchMedia("(min-width: 768px)");
    const lg = matchMedia("(min-width: 1024px)");
    const xl = matchMedia("(min-width: 1280px)");

    const compute = () => {
      setPv(xl.matches ? 4 : lg.matches ? 3 : md.matches ? 2 : 1);
    };

    compute();
    [md, lg, xl].forEach((mq) => mq.addEventListener("change", compute));

    return () =>
      [md, lg, xl].forEach((mq) =>
        mq.removeEventListener("change", compute)
      );
  }, []);

  return pv;
}

export default function CourseCarousel() {
  const courses = mockCourses;
  const perView = usePerView();
  const [page, setPage] = useState(0);

  useEffect(() => setPage(0), [perView]);

  const pages = Math.ceil(courses.length / perView);
  const maxPage = pages - 1;

  const go = (dir: "prev" | "next") => {
    setPage((p) =>
      Math.min(maxPage, Math.max(0, p + (dir === "next" ? 1 : -1)))
    );
  };

  const trackWidthPct = pages * 100;
  const translatePct = page * (100 / pages);
  const itemBasisPct = 100 / (perView * pages);

  return (
    <div className="relative overflow-hidden">
      {/* TRACK */}
      <div
        className="flex transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] gap-4"
        style={{
          width: `${trackWidthPct}%`,
          transform: `translateX(-${translatePct}%)`,
        }}
      >
        {courses.map((c) => (
          <div key={c.id} style={{ flex: `0 0 ${itemBasisPct}%` }}>
            <CourseCard {...c} />
          </div>
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        aria-label="Previous"
        onClick={() => go("prev")}
        disabled={page === 0}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          h-12 w-12 grid place-content-center rounded-full
          bg-white text-lime-600
          shadow-[0_4px_15px_rgba(0,0,0,0.12)]
          hover:scale-105 hover:shadow-[0_6px_20px_rgba(101,216,48,0.4)]
          transition
          disabled:opacity-40 disabled:hover:scale-100
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* RIGHT ARROW */}
      <button
        aria-label="Next"
        onClick={() => go("next")}
        disabled={page === maxPage}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          h-12 w-12 grid place-content-center rounded-full
          bg-white text-lime-600
          shadow-[0_4px_15px_rgba(0,0,0,0.12)]
          hover:scale-105 hover:shadow-[0_6px_20px_rgba(101,216,48,0.4)]
          transition
          disabled:opacity-40 disabled:hover:scale-100
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* EDGE FADES */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
