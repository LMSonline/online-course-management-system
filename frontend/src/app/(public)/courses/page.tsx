"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { courseReviewService } from "@/services/courses/course-review.service";
import { useCategoryTree } from "@/hooks/category/useCategoryTree";
import { MyCourseRow } from "@/core/components/learner/dashboard/MyCourseRow";
import CourseCardMini from "@/core/components/course/CourseCardMini";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import type { CategoryResponse } from "@/services/courses/course.types";

export default function CourseListScreen() {
  const [search, setSearch] = React.useState("");
  const [selectedParentId, setSelectedParentId] = React.useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = React.useState<number | null>(null);

  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 16;

  /* ================= DATA ================= */
  const { data } = useQuery({
    queryKey: ["all-active-courses"],
    queryFn: () => courseService.getCoursesActive({ page: 0, size: 1000 }),
  });

  const { data: categoryTree, isLoading } = useCategoryTree();

  const [courses, setCourses] = React.useState<MyCourse[]>([]);
  React.useEffect(() => {
    async function mapCourses() {
      if (!data?.items) return setCourses([]);
      const token = (await import("@/lib/api/tokenStorage")).tokenStorage.getAccessToken();
      console.log("[DEBUG] Access token for course version API:", token);
      const mapped = await Promise.all(
        data.items.map(async (c: any) => {
          let rating = 0;
          let price = "₫0";
          let publicVersionId = c.publicVersionId;
          let courseId = c.id;
          try {
            const summary = await courseReviewService.getRatingSummary(c.id);
            rating = summary.averageRating || 0;
          } catch {}
          // Always fetch course detail by slug to get latest publicVersionId
          try {
            const detail = await courseService.getCourseBySlug(c.slug);
            if (detail && detail.PublicVersionId) {
              publicVersionId = detail.PublicVersionId;
              courseId = detail.id;
            }
          } catch {}
          if (publicVersionId && token) {
            try {
              const version = await courseService.getCourseVersion(courseId, publicVersionId, token);
              if (typeof version.price === "number") {
                price = version.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
              }
            } catch {}
          }
          return {
            id: String(c.id),
            slug: c.slug,
            title: c.title,
            instructor: c.teacherName || "Unknown",
            thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
            thumbnailUrl: c.thumbnailUrl,
            progress: 0,
            lastViewed: "New",
            level: mapDifficultyToLevel(c.difficulty),
            category: c.categoryName || "General",
            rating,
            price,
          };
        })
      );
      setCourses(mapped);
    }
    mapCourses();
  }, [data]);

  /* ================= FILTER ================= */
  const filteredCourses = courses.filter((c) =>
    [c.title, c.instructor, c.category]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pagedCourses = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCourses.slice(start, start + PAGE_SIZE);
  }, [filteredCourses, page]);

  const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);

  function groupCoursesByCategory(
    courses: MyCourse[],
    categories: CategoryResponse[]
  ): Record<number, MyCourse[]> {
    const map: Record<number, MyCourse[]> = {};
    for (const cat of categories) {
      map[cat.id] = [];
      if (cat.children?.length) {
        Object.assign(map, groupCoursesByCategory(courses, cat.children));
      }
    }
    for (const course of courses) {
      const cat = categories.find((c) => c.name === course.category);
      if (cat) map[cat.id].push(course);
    }
    return map;
  }

  /* ================= AUTO SELECT ================= */
  React.useEffect(() => {
    if (!categoryTree || !filteredCourses.length || selectedParentId) return;
    for (const cat of categoryTree) {
      const grouped = groupCoursesByCategory(filteredCourses, [cat]);
      if (grouped[cat.id]?.length || cat.children?.some(c => grouped[c.id]?.length)) {
        setSelectedParentId(cat.id);
        break;
      }
    }
  }, [categoryTree, filteredCourses]);

  React.useEffect(() => {
    if (!selectedParentId || !categoryTree || selectedChildId) return;
    const parent = categoryTree.find(c => c.id === selectedParentId);
    for (const child of parent?.children || []) {
      const grouped = groupCoursesByCategory(filteredCourses, [child]);
      if (grouped[child.id]?.length) {
        setSelectedChildId(child.id);
        break;
      }
    }
  }, [selectedParentId, categoryTree, filteredCourses]);

  /* ================= UI ================= */
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* ================= HERO ================= */}
      <section className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black px-10 py-12 shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Explore Courses
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Browse curated courses, explore categories, and continue your learning journey.
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses, instructors, topics…"
          className="mt-8 w-full max-w-lg rounded-xl border border-white/10
            bg-slate-900 px-5 py-3 text-sm text-white
            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </section>

      {/* ================= CATEGORY NAV ================= */}
      {!isLoading && categoryTree && (
        <section className="mb-14">
          {/* Parent */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categoryTree.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedParentId(cat.id);
                  setSelectedChildId(null);
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition
                  ${
                    selectedParentId === cat.id
                      ? "bg-emerald-500 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Child */}
          {selectedParentId && (
            <div className="flex gap-8 border-b border-white/10">
              {categoryTree
                .find(c => c.id === selectedParentId)
                ?.children?.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`pb-3 text-sm font-medium transition
                      ${
                        selectedChildId === child.id
                          ? "border-b-2 border-emerald-400 text-emerald-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                  >
                    {child.name}
                  </button>
                ))}
            </div>
          )}
        </section>
      )}

      {/* ================= FEATURED COURSES ================= */}
      {selectedParentId && selectedChildId && categoryTree && (
        <section className="mb-20">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Courses in this category
          </h2>

          {(() => {
            const parent = categoryTree.find(c => c.id === selectedParentId);
            const child = parent?.children?.find(c => c.id === selectedChildId);
            if (!child) return null;

            const grouped = groupCoursesByCategory(filteredCourses, [child]);
            const list = grouped[child.id] || [];

            return (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {list.map(c => (
                  <MyCourseRow key={c.id} course={c} />
                ))}
              </div>
            );
          })()}
        </section>
      )}

      {/* ================= ALL COURSES ================= */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">All Courses</h2>
          <span className="text-sm text-slate-400">
            {filteredCourses.length} courses
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
          {pagedCourses.map(c => (
            <CourseCardMini
              key={c.id}
              id={c.id}
              title={c.title}
              teacher={c.instructor}
              image={c.thumbnailUrl || "/images/lesson_thum.png"}
              rating={c.rating}
              price={c.price || "₫0"}
              href={`/courses/${c.slug}`}
              category={c.category}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm
                text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm
                text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= HELPER ================= */
function mapDifficultyToLevel(
  difficulty?: string
): "Beginner" | "Intermediate" | "Advanced" {
  if (difficulty === "BEGINNER") return "Beginner";
  if (difficulty === "INTERMEDIATE") return "Intermediate";
  if (difficulty === "ADVANCED") return "Advanced";
  return "Beginner";
}
