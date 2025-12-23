// src/app/(learner)/courses/[slug]/learn/page.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { CoursePlayerShell } from "@/core/components/learner/player/CoursePlayerShell";
import { MOCK_PLAYER_COURSE } from "@/lib/learner/player/types";
import type { PlayerCourse } from "@/lib/learner/player/types";
import {
  getCourseBySlug,
  getChapters,
  getLessonsByChapter,
  getVideoStreamUrl,
} from "@/features/courses/services/courses.service";
import { getLessonComments, createLessonComment, type CommentResponse } from "@/features/community/services/community.service";
import { USE_MOCK } from "@/config/runtime";

export default function CoursePlayerPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [course, setCourse] = useState<PlayerCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCK) {
          // Fallback to mock for now
          if (slug === "d2" || slug === MOCK_PLAYER_COURSE.slug) {
            setCourse(MOCK_PLAYER_COURSE);
            return;
          }
          throw new Error("Course not found");
        }

        // Fetch course detail
        const courseDetail: any = await getCourseBySlug(slug);
        if (!courseDetail.id) {
          throw new Error("Course not found");
        }

        const courseId = parseInt(courseDetail.id);
        // Try to get versionId from course detail, fallback to a default if not available
        const versionId = courseDetail.PublicVersionId || courseDetail.publicVersionId;
        
        if (!versionId) {
          // If no versionId, we can't load chapters - show a message
          throw new Error("Course content not yet available. Please check back later.");
        }

        // Fetch chapters
        const chapters = await getChapters(courseId, versionId);

        // Fetch lessons for each chapter
        const sections = await Promise.all(
          chapters.map(async (chapter) => {
            const lessons = await getLessonsByChapter(chapter.id);
            return {
              id: chapter.id.toString(),
              title: chapter.title,
              lessons: await Promise.all(
                lessons.map(async (lesson) => {
                  let videoUrl = lesson.videoUrl || "";
                  if (!videoUrl && lesson.id) {
                    try {
                      videoUrl = await getVideoStreamUrl(lesson.id);
                    } catch (err) {
                      console.warn("Failed to get video stream URL:", err);
                    }
                  }
                  return {
                    id: lesson.id.toString(),
                    title: lesson.title,
                    duration: formatDuration(lesson.duration || 0),
                    videoUrl: videoUrl || "",
                    isPreview: false,
                  };
                })
              ),
            };
          })
        );

        setCourse({
          slug: courseDetail.slug,
          title: courseDetail.title,
          level: courseDetail.level,
          sections,
        });
      } catch (err: any) {
        console.error("Failed to load course:", err);
        setError(err.message || "Failed to load course");
        // Fallback to mock if available
        if (slug === "d2" || slug === MOCK_PLAYER_COURSE.slug) {
          setCourse(MOCK_PLAYER_COURSE);
        }
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCourse();
    }
  }, [slug]);

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading course player...</p>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!course) {
    return notFound();
  }

  return (
    <div className="flex flex-col">
      <CoursePlayerShell course={course} />
      {/* Comments section - can be added as a separate component below the player */}
    </div>
  );
}
