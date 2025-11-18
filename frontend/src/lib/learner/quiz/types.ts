// src/lib/learner/quiz/types.ts

export type QuizStatus = "Not started" | "In progress" | "Submitted";

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: QuizOption[];
  multiple: boolean;
  points: number;
  explanation?: string;
};

export type QuizDetail = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  status: QuizStatus;
  estimatedMinutes: number;
  totalPoints: number;
  questions: QuizQuestion[];
};

export const MOCK_QUIZ: QuizDetail = {
  id: "a1", // trùng với assessment id quiz trong ASSESSMENTS_MOCK
  courseId: "d2",
  courseTitle: "React, TypeScript & Next.js – Build Modern Web Apps",
  title: "Module 1 • React fundamentals",
  status: "In progress",
  estimatedMinutes: 20,
  totalPoints: 10,
  questions: [
    {
      id: "q1",
      text: "What is the main purpose of React in a web application?",
      multiple: false,
      points: 3,
      options: [
        { id: "q1a", label: "To manage the backend database" },
        { id: "q1b", label: "To build user interfaces with components" },
        { id: "q1c", label: "To handle server-side rendering only" },
        { id: "q1d", label: "To replace HTML and CSS completely" },
      ],
      explanation:
        "React is a JavaScript library focused on building user interfaces from reusable components.",
    },
    {
      id: "q2",
      text: "Which statements about JSX are correct?",
      multiple: true,
      points: 4,
      options: [
        { id: "q2a", label: "JSX allows you to write HTML-like syntax in JS/TS files." },
        { id: "q2b", label: "JSX is compiled to plain JavaScript function calls." },
        { id: "q2c", label: "JSX can only be used with class components." },
        { id: "q2d", label: "JSX must always return a single parent element." },
      ],
      explanation:
        "JSX is syntactic sugar compiled to React.createElement calls and each JSX expression must have a single root element.",
    },
    {
      id: "q3",
      text: "In a React + TypeScript project, what is a good place to store reusable types shared across components?",
      multiple: false,
      points: 3,
      options: [
        { id: "q3a", label: "Inside each component file only" },
        { id: "q3b", label: "In a shared /types or /lib directory" },
        { id: "q3c", label: "In .env files" },
        { id: "q3d", label: "They should not be reused" },
      ],
      explanation:
        "Shared types are usually placed in a dedicated /types or /lib directory so multiple components can import them.",
    },
  ],
};
