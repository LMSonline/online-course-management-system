// Course catalog types

export type CourseSummary = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  ratingCount: number;
  students: number;
  duration: string; // "12h 30m"
  lectures: number;
  thumbColor: string; // tailwind gradient
  tag?: "Bestseller" | "New" | "Highest rated";
  priceLabel: string; // "₫2,239,000" hoặc "Included in subscription"
};

export const COURSE_CATEGORIES = [
  "All",
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Design",
  "Software Engineering",
  "AI & Machine Learning",
] as const;

export type CategoryKey = (typeof COURSE_CATEGORIES)[number];

