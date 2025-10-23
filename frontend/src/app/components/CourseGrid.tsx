"use client";

import CourseCard, { type Course } from "./CourseCard";
import CourseHoverCard from "@/app/components/CourseHoverCard";
import { previewFromCourse } from "@/app/components/previewAdapters"; // <-- adapter

const sample = Array.from({ length: 8 }).map((_, i) => ({
  id: `sample-${i + 1}`,

  title: `Sample Course #${i + 1}: Next.js + Tailwind`,
  teacher: "Author",
  price: "₫199,000",
  rating: 4.6,
  image: "/images/lesson_thum.png",

}));

export default function CourseGrid() {
  return (
    <div className="relative isolate overflow-visible">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-10">
        {sample.map((course) => (
          <CourseHoverCard
            key={course.id}
            preview={previewFromCourse(course)}
            anchorClassName="block h-full"
          >
            <CourseCard {...course} />
          </CourseHoverCard>
        ))}
      </div>
    </div>
  );
}
