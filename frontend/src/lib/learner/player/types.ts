// src/components/learner/player/types.ts
export type Lesson = {
  id: string;
  title: string;
  duration: string;      // "08:45"
  isPreview?: boolean;
  completed?: boolean;
};

export type LessonSection = {
  id: string;
  title: string;
  lecturesCount: number;
  duration: string;
  lessons: Lesson[];
};

export type PlayerCourseMeta = {
  id: string;
  slug: string;
  title: string;
  progress: number;      // 0..100
  totalDuration: string;
  sections: LessonSection[];
};

export const MOCK_PLAYER_COURSE: PlayerCourseMeta = {
  id: "react-ts-web-apps",
  slug: "react-typescript-modern-web-apps",
  title: "React & TypeScript for Modern Web Apps",
  progress: 42,
  totalDuration: "12h 35m",
  sections: [
    {
      id: "s1",
      title: "Getting Started with React & TypeScript",
      lecturesCount: 5,
      duration: "55m",
      lessons: [
        {
          id: "l1",
          title: "Welcome & course overview",
          duration: "06:12",
          isPreview: true,
          completed: true,
        },
        {
          id: "l2",
          title: "Setting up your environment",
          duration: "11:34",
          completed: true,
        },
        {
          id: "l3",
          title: "Creating first React + TS app",
          duration: "15:20",
        },
        {
          id: "l4",
          title: "VS Code tips for productivity",
          duration: "12:05",
        },
        {
          id: "l5",
          title: "Understanding JSX and TSX",
          duration: "09:52",
        },
      ],
    },
    {
      id: "s2",
      title: "Components, Props & State",
      lecturesCount: 6,
      duration: "1h 20m",
      lessons: [
        {
          id: "l6",
          title: "Functional components & props",
          duration: "14:10",
        },
        {
          id: "l7",
          title: "Type-safe props with TypeScript",
          duration: "16:03",
        },
        {
          id: "l8",
          title: "State and event handling",
          duration: "18:21",
        },
        {
          id: "l9",
          title: "Derived state & memoization",
          duration: "11:45",
        },
        {
          id: "l10",
          title: "Component composition patterns",
          duration: "10:36",
        },
        {
          id: "l11",
          title: "Mini project: reusable card component",
          duration: "09:34",
        },
      ],
    },
  ],
};
