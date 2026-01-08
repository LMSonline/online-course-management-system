// src/app/(learner)/courses/[slug]/learn/page.tsx
"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { CoursePlayerShell } from "@/core/components/learner/player/CoursePlayerShell";
import { MOCK_PLAYER_COURSE } from "@/lib/learner/player/types";

export default function CoursePlayerPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const course =
    slug === "d2" || slug === MOCK_PLAYER_COURSE.slug
      ? MOCK_PLAYER_COURSE
      : null;

  if (!course) return notFound();
  // 👈 luôn load mock

  useEffect(() => {
    // call API theo slug ở đây sau này
  }, [slug]);

  // KHÔNG gọi notFound ở giai đoạn mock nữa
  return <CoursePlayerShell course={course} />;
}
