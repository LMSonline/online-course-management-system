// src/components/learner/catalog/types.ts
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

export const COURSE_CATALOG_MOCK: CourseSummary[] = [
  {
    id: "d1",
    title: "The Complete Python Pro Bootcamp for 2025",
    instructor: "Dr. Angela Yu",
    category: "Web Development",
    level: "Beginner",
    rating: 4.8,
    ratingCount: 397_111,
    students: 1_675_958,
    duration: "64h",
    lectures: 530,
    thumbColor: "from-amber-500 via-pink-500 to-purple-500",
    tag: "Bestseller",
    priceLabel: "₫2,239,000",
  },
  {
    id: "d2",
    title: "React, TypeScript & Next.js – Build Modern Web Apps",
    instructor: "Alex Nguyen",
    category: "Web Development",
    level: "Intermediate",
    rating: 4.7,
    ratingCount: 85_230,
    students: 302_114,
    duration: "29h",
    lectures: 210,
    thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
    tag: "Highest rated",
    priceLabel: "₫1,709,000",
  },
  {
    id: "d3",
    title: "Mastering Data Science with Python & Pandas",
    instructor: "Linh Tran",
    category: "Data Science",
    level: "Intermediate",
    rating: 4.8,
    ratingCount: 50_112,
    students: 180_342,
    duration: "32h",
    lectures: 190,
    thumbColor: "from-sky-500 via-teal-500 to-emerald-500",
    tag: "Bestseller",
    priceLabel: "₫1,299,000",
  },
  {
    id: "d4",
    title: "Prompt Engineering & LLMs for Developers",
    instructor: "Minh Dao",
    category: "AI & Machine Learning",
    level: "Intermediate",
    rating: 4.9,
    ratingCount: 22_430,
    students: 73_015,
    duration: "14h",
    lectures: 95,
    thumbColor: "from-emerald-500 via-cyan-500 to-sky-500",
    tag: "New",
    priceLabel: "₫1,019,000",
  },
  {
    id: "d5",
    title: "Clean Architecture & DDD with Spring Boot",
    instructor: "Thanh D.",
    category: "Software Engineering",
    level: "Advanced",
    rating: 4.7,
    ratingCount: 18_341,
    students: 51_220,
    duration: "21h",
    lectures: 140,
    thumbColor: "from-lime-500 via-emerald-500 to-cyan-500",
    priceLabel: "₫1,409,000",
  },
  {
    id: "d6",
    title: "Figma & UI Design Fundamentals",
    instructor: "Han Vo",
    category: "Design",
    level: "Beginner",
    rating: 4.6,
    ratingCount: 9_321,
    students: 28_410,
    duration: "11h",
    lectures: 80,
    thumbColor: "from-fuchsia-500 via-purple-500 to-indigo-500",
    tag: "Bestseller",
    priceLabel: "₫699,000",
  },
  {
    id: "d7",
    title: "Flutter & Dart – Build Mobile Apps for iOS & Android",
    instructor: "Tien Nguyen",
    category: "Mobile Development",
    level: "Intermediate",
    rating: 4.6,
    ratingCount: 40_210,
    students: 150_210,
    duration: "36h",
    lectures: 240,
    thumbColor: "from-blue-500 via-sky-500 to-cyan-500",
    priceLabel: "₫1,509,000",
  },
  {
    id: "d8",
    title: "Machine Learning A–Z with Scikit-learn",
    instructor: "Dat Ho",
    category: "AI & Machine Learning",
    level: "Beginner",
    rating: 4.7,
    ratingCount: 60_110,
    students: 210_304,
    duration: "38h",
    lectures: 220,
    thumbColor: "from-teal-500 via-emerald-500 to-lime-500",
    priceLabel: "₫1,809,000",
  },
];
