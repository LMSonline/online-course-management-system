// src/lib/learner/player/types.ts

export type PlayerLesson = {
  id: string;
  title: string;
  duration: string;      // "08:45"
  videoUrl: string;
  isPreview?: boolean;
};

export type PlayerSection = {
  id: string;
  title: string;
  lessons: PlayerLesson[];
};

export type PlayerCourse = {
  slug: string;          // trùng với slug khoá học
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  sections: PlayerSection[];
};

export const MOCK_PLAYER_COURSE: PlayerCourse = {
  slug: "react-typescript-modern-web-apps",
  title: "React, TypeScript & Next.js – Build Modern Web Apps",
  level: "Intermediate",
  sections: [
    {
      id: "s1",
      title: "Getting started",
      lessons: [
        {
          id: "l1",
          title: "Welcome to the course",
          duration: "05:12",
          videoUrl: "/video/sample-1.mp4", // có thể để tạm file placeholder
          isPreview: true,
        },
        {
          id: "l2",
          title: "Project overview & setup",
          duration: "12:34",
          videoUrl: "/video/sample-2.mp4",
        },
      ],
    },
    {
      id: "s2",
      title: "React fundamentals",
      lessons: [
        {
          id: "l3",
          title: "Components & JSX",
          duration: "10:03",
          videoUrl: "/video/sample-3.mp4",
        },
        {
          id: "l4",
          title: "Props, state & events",
          duration: "14:27",
          videoUrl: "/video/sample-4.mp4",
        },
      ],
    },
  ],
};
