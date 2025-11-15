// src/app/components/previewAdapters.ts
import type { CoursePreview } from "@/core/components/course/CourseHoverCard";
import type { SkillCourse } from "@/core/components/course/SkillCourseCard";
import type { Course } from "@/core/components/course/CourseCard"; // type của bạn

export function previewFromSkillCourse(c: SkillCourse): CoursePreview {
    return {
        title: c.title,
        updated: "September 2025",
        meta: "15 total hours · Beginner Level · Subtitles",
        summary:
            "Solve real-world problems with hands-on projects and templates. Learn by doing.",
        bullets: [
            "Master core concepts step by step",
            "Practical projects & templates",
            "Career-ready skills",
        ],
        price: c.price,
        ctaLabel: "Add to cart",
    };
}

export function previewFromCourse(c: Course): CoursePreview {
  return {
    title: c.title,
    updated: "September 2025",
    meta: "15 total hours · Beginner Level · Subtitles",
    summary:
      "Build real projects with hands-on practice. Templates included — learn by doing.",
    bullets: [
      "Master core concepts step by step",
      "Practical projects & templates",
      "Career-ready skills",
    ],
    price: c.price,
    ctaLabel: "Add to cart",
  };
}
