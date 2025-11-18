// src/lib/learner/assignments/types.ts

export type AssessmentType = "Quiz" | "Assignment";

export type AssessmentStatus =
  | "Not started"
  | "In progress"
  | "Submitted"
  | "Graded"
  | "Overdue";

export type AssessmentSummary = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseLevel: "Beginner" | "Intermediate" | "Advanced";
  type: AssessmentType;
  title: string;
  status: AssessmentStatus;
  dueDate: string;        // "2025-03-15"
  dueLabel: string;       // "Due in 2 days" / "Overdue 1 day"
  estimatedMinutes: number;
  score?: number;         // 82
  maxScore?: number;      // 100
  attemptsUsed?: number;
  maxAttempts?: number;
  tag?: "Required" | "Optional";
};

export const ASSESSMENTS_MOCK: AssessmentSummary[] = [
  {
    id: "a1",
    courseId: "d2",
    courseTitle: "React, TypeScript & Next.js – Build Modern Web Apps",
    courseLevel: "Intermediate",
    type: "Quiz",
    title: "Module 1 • React fundamentals",
    status: "Not started",
    dueDate: "2025-03-20",
    dueLabel: "Due in 2 days",
    estimatedMinutes: 20,
    attemptsUsed: 0,
    maxAttempts: 3,
    tag: "Required",
  },
  {
    id: "a2",
    courseId: "d2",
    courseTitle: "React, TypeScript & Next.js – Build Modern Web Apps",
    courseLevel: "Intermediate",
    type: "Assignment",
    title: "Build a responsive landing page",
    status: "In progress",
    dueDate: "2025-03-18",
    dueLabel: "Due tomorrow",
    estimatedMinutes: 90,
    attemptsUsed: 1,
    maxAttempts: 2,
    tag: "Required",
  },
  {
    id: "a3",
    courseId: "d1",
    courseTitle: "The Complete Python Pro Bootcamp for 2025",
    courseLevel: "Beginner",
    type: "Quiz",
    title: "Python basics & control flow",
    status: "Graded",
    dueDate: "2025-03-10",
    dueLabel: "Submitted • Mar 09",
    estimatedMinutes: 25,
    score: 18,
    maxScore: 20,
    attemptsUsed: 1,
    maxAttempts: 3,
    tag: "Optional",
  },
  {
    id: "a4",
    courseId: "d3",
    courseTitle: "Mastering Data Science with Python & Pandas",
    courseLevel: "Intermediate",
    type: "Assignment",
    title: "Data cleaning mini-project",
    status: "Overdue",
    dueDate: "2025-03-12",
    dueLabel: "Overdue 3 days",
    estimatedMinutes: 120,
    attemptsUsed: 0,
    maxAttempts: 2,
    tag: "Required",
  },
];
