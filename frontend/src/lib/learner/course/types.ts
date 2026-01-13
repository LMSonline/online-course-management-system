// src/components/learner/course/types.ts
export type CourseSection = {
  id: string;
  title: string;
  lecturesCount: number;
  duration: string;
};

export type CourseDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  lastUpdated: string;
  language: string;
  subtitles: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  whatYouWillLearn: string[];
  includes: string[];
  sections: CourseSection[];
  description: string;
  instructor: {
    name: string;
    title: string;
    avatarUrl?: string;
    about: string;
  };
  thumbnail_Url?: string;
};

export const MOCK_COURSE: CourseDetail = {
  id: "d2", 
  slug: "react-typescript-modern-web-apps",
  title: "React & TypeScript for Modern Web Apps",
  subtitle:
    "Build production-ready frontends with React, TypeScript, hooks, and clean architecture.",
  rating: 4.7,
  ratingCount: 12034,
  studentsCount: 84532,
  lastUpdated: "November 2025",
  language: "English",
  subtitles: ["English", "Vietnamese"],
  level: "Intermediate",
  whatYouWillLearn: [
    "Build real-world React applications with TypeScript and hooks.",
    "Structure your frontend with clean, scalable architecture patterns.",
    "Integrate APIs, handle errors, and manage loading states professionally.",
    "Optimize performance and improve UX with best practices.",
  ],
  includes: [
    "18 hours on-demand video",
    "25 coding exercises",
    "Downloadable resources",
    "Full lifetime access",
    "Access on mobile and TV",
    "Certificate of completion",
  ],
  sections: [
    {
      id: "sec1",
      title: "Getting Started with React & TypeScript",
      lecturesCount: 8,
      duration: "1h 25m",
    },
    {
      id: "sec2",
      title: "Components, Props & State Management",
      lecturesCount: 12,
      duration: "2h 40m",
    },
    {
      id: "sec3",
      title: "Real-world Project: LMS Dashboard",
      lecturesCount: 15,
      duration: "4h 10m",
    },
  ],
  description:
    "In this course, you'll build modern web applications using React and TypeScript. We'll start from the fundamentals and quickly move to real-world patterns used in production apps, focusing on clean code, reusable components, and great developer experience.",
  instructor: {
    name: "Alex Nguyen",
    title: "Senior Frontend Engineer & Instructor",
    avatarUrl: undefined,
    about:
      "Alex has 8+ years of experience building and scaling frontend applications for startups and global companies. He focuses on clean architecture, developer experience, and teaching by building real-world projects.",
  },
};
