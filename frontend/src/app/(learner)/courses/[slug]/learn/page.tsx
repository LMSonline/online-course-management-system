// src/app/(learner)/courses/[slug]/learn/page.tsx
"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { CoursePlayerShell } from "@/core/components/learner/player/CoursePlayerShell";
import { MOCK_PLAYER_COURSE } from "@/lib/learner/player/types";

export default function CoursePlayerPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const course = MOCK_PLAYER_COURSE.id === slug ? MOCK_PLAYER_COURSE : null;

  useEffect(() => {
    // TODO: sau này call API lấy nội dung lesson, video URL,...
  }, [slug]);

  if (!course) return notFound();

  return <CoursePlayerShell course={course} />;
}
