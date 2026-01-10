// src/components/learner/dashboard/types.ts
export type MyCourse = {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  thumbColor: string; // Tailwind gradient classes
  thumbnailUrl?: string; // URL ảnh đại diện khóa học
  progress: number;
  lastViewed: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
  price?: string;
};

export const MOCK_COURSES: MyCourse[] = [
  {
    id: "c1",
    slug: "react-typescript-modern-web-apps",
    title: "React & TypeScript for Modern Web Apps",
    instructor: "Alex Nguyen",
    thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
    progress: 42,
    lastViewed: "2 days ago",
    level: "Intermediate",
    category: "Web Development",
    rating: 4.7,
  },
  {
    id: "c2",
    slug: "react-typescript-modern-web-apps",
    title: "Python for Data Analysis & Visualization",
    instructor: "Dr. Linh Tran",
    thumbColor: "from-purple-500 via-fuchsia-500 to-rose-500",
    progress: 68,
    lastViewed: "Yesterday",
    level: "Beginner",
    category: "Data Science",
    rating: 4.8,
  },
  {
    id: "c3",
    slug: "react-typescript-modern-web-apps",
    title: "Clean Architecture with Spring Boot",
    instructor: "Thanh D.",
    thumbColor: "from-lime-500 via-emerald-500 to-cyan-500",
    progress: 15,
    lastViewed: "5 days ago",
    level: "Advanced",
    category: "Backend",
    rating: 4.6,
  },
];

// === thêm block này cho phần recommended ===
export const RECOMMENDED_COURSES: MyCourse[] = [
  {
    id: "r1",
    slug: "react-typescript-modern-web-apps",
    title: "Next.js & React 18 – Full Guide",
    instructor: "Jane Pham",
    thumbColor: "from-sky-500 via-indigo-500 to-violet-500",
    progress: 0,
    lastViewed: "Just added",
    level: "Intermediate",
    category: "Web Development",
    rating: 4.8,
  },
  {
    id: "r2",
    slug: "react-typescript-modern-web-apps",
    title: "Prompt Engineering for Developers",
    instructor: "Minh Dao",
    thumbColor: "from-emerald-500 via-cyan-500 to-sky-500",
    progress: 0,
    lastViewed: "New",
    level: "Intermediate",
    category: "AI & LLMs",
    rating: 4.9,
  },
  {
    id: "r3",
    slug: "react-typescript-modern-web-apps",
    title: "Data Structures & Algorithms in JS",
    instructor: "Khang Le",
    thumbColor: "from-amber-500 via-orange-500 to-rose-500",
    progress: 0,
    lastViewed: "New",
    level: "Beginner",
    category: "Computer Science",
    rating: 4.7,
  },
  {
    id: "r4",
    slug: "react-typescript-modern-web-apps",
    title: "Design Patterns with TypeScript",
    instructor: "Huy Tran",
    thumbColor: "from-fuchsia-500 via-purple-500 to-indigo-500",
    progress: 0,
    lastViewed: "New",
    level: "Advanced",
    category: "Software Design",
    rating: 4.8,
  },
  {
    id: "r5",
    slug: "react-typescript-modern-web-apps",
    title: "Docker & Kubernetes for Backend Devs",
    instructor: "Lan Vo",
    thumbColor: "from-cyan-500 via-sky-500 to-blue-500",
    progress: 0,
    lastViewed: "New",
    level: "Intermediate",
    category: "DevOps",
    rating: 4.7,
  },
  {
    id: "r6",
    slug: "react-typescript-modern-web-apps",
    title: "Practical SQL & PostgreSQL",
    instructor: "Dat Nguyen",
    thumbColor: "from-emerald-500 via-lime-500 to-yellow-400",
    progress: 0,
    lastViewed: "New",
    level: "Beginner",
    category: "Databases",
    rating: 4.6,
  },
];
