// src/lib/teacher/course-management/types.ts

export type CourseVersion = {
  id: string;
  label: string; // "v1.0", "Draft v2"
  note?: string;
  createdAt: string; // "Mar 10, 2025"
  isCurrent: boolean;
};

export type CurriculumItemType =
  | "lecture"
  | "quiz"
  | "assignment"
  | "question-bank";

export type CurriculumItem = {
  id: string;
  type: CurriculumItemType;
  title: string;
  duration?: string; // "08:45" (cho lecture/quiz)
  questionsCount?: number; // quiz/question-bank
  isPreview?: boolean;
};

export type CurriculumSection = {
  id: string;
  title: string;
  description?: string;
  items: CurriculumItem[];
};

export type TeacherCourseManage = {
  id: string;
  title: string;
  status: "Draft" | "Published";
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  lastUpdated: string;
  versions: CourseVersion[];
  sections: CurriculumSection[];
};

export const MOCK_TEACHER_COURSE_MANAGE: TeacherCourseManage = {
  id: "c1",
  title: "React & TypeScript for Modern Web Apps",
  status: "Draft",
  level: "Intermediate",
  category: "Web Development",
  lastUpdated: "Mar 18, 2025 · Draft v2 in progress",
  versions: [
    {
      id: "v1",
      label: "v1.0",
      note: "Published main version",
      createdAt: "Jan 12, 2025",
      isCurrent: false,
    },
    {
      id: "v2",
      label: "Draft v2",
      note: "Adding LMS case study and new quizzes",
      createdAt: "Mar 08, 2025",
      isCurrent: true,
    },
  ],
  sections: [
    {
      id: "s1",
      title: "Getting started",
      description: "Course overview, setup and environment.",
      items: [
        {
          id: "i1",
          type: "lecture",
          title: "Welcome to the course",
          duration: "05:12",
          isPreview: true,
        },
        {
          id: "i2",
          type: "lecture",
          title: "Project overview: LMS platform",
          duration: "09:34",
        },
        {
          id: "i3",
          type: "quiz",
          title: "Quiz — Fundamentals warm-up",
          duration: "10:00",
          questionsCount: 8,
        },
      ],
    },
    {
      id: "s2",
      title: "React basics",
      description: "Components, JSX and state.",
      items: [
        {
          id: "i4",
          type: "lecture",
          title: "Components & JSX",
          duration: "12:45",
        },
        {
          id: "i5",
          type: "lecture",
          title: "Props, state & events",
          duration: "14:03",
        },
        {
          id: "i6",
          type: "assignment",
          title: "Mini project: counter & todo app",
        },
        {
          id: "i7",
          type: "question-bank",
          title: "Question bank – React basics",
          questionsCount: 25,
        },
      ],
    },
  ],
};
