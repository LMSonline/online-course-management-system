"use client";

import CourseCard, { type Course } from "./CourseCard";
import CourseHoverCard from "@/core/components/course/CourseHoverCard";
import { previewFromCourse } from "@/core/components/infra/PreviewAdapters"; // <-- adapter

// Sample data (typed as Course so CourseCard gets correct props)
const sample: Course[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `sample-${i + 1}`,
  title: `Sample Course #${i + 1}: Next.js + Tailwind`,
  teacher: "Author",
  price: "₫199,000",
  rating: 4.6,
  image: "/images/lesson_thum.png",
  // optional:
  // originalPrice: "₫1,299,000",
  // bestSeller: i % 3 === 0,
  // href: `/course/${i + 1}`,
}));

export default function CourseGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-10">
      {sample.map((course) => (
        <CourseHoverCard
          key={course.id ?? course.title}
          preview={previewFromCourse(course)}   // <-- build preview for hover panel
          anchorClassName="h-full block"
        >
          <CourseCard {...course} />
        </CourseHoverCard>
      ))}
    </div>
  );
}
