// src/app/(learner)/quiz/[id]/page.tsx
import { notFound } from "next/navigation";
import { MOCK_QUIZ } from "@/lib/learner/quiz/types";
import { QuizPlayerShell } from "@/core/components/learner/quiz/QuizPlayerShell";

export default function QuizDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: sau này fetch từ API theo id
  const quiz = MOCK_QUIZ.id === params.id ? MOCK_QUIZ : null;

  if (!quiz) return notFound();

  return <QuizPlayerShell quiz={quiz} />;
}
