"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { learnerCourseService } from "@/services/learner/courseService";
import { useCategoryTree } from "@/hooks/learner/useCategory";
import { MyCourseRow } from "@/core/components/learner/dashboard/MyCourseRow";
import CourseCardMini from "@/core/components/course/CourseCardMini";
import { formatCourseVersionPrice } from "@/lib/learner/course-version";
import { learnerCourseVersionService } from "@/services/learner/course-version.service";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import type { CategoryResponse } from "@/services/courses/course.types";

export default function CourseListScreen() {
    const [search, setSearch] = React.useState("");
    const [selectedParentId, setSelectedParentId] = React.useState<number | null>(null);
    const [selectedChildId, setSelectedChildId] = React.useState<number | null>(null);

    const [page, setPage] = React.useState(1);
    const PAGE_SIZE = 16;

    // Lấy danh sách khoá học public
    const { data } = useQuery({
        queryKey: ["all-active-courses"],
        queryFn: () => learnerCourseService.getCourses({ page: 0, size: 1000 }),
    });

    const { data: categoryTree, isLoading } = useCategoryTree();

    // Map dữ liệu về MyCourse
    const [courses, setCourses] = React.useState<MyCourse[]>([]);
    React.useEffect(() => {
        if (!data?.items) return setCourses([]);
        const mapped = data.items.map((c: any) => ({
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
            rating: c.rating || 0,
            // price is not part of MyCourse, handle separately below
        }));
        setCourses(mapped);
    }, [data]);

    // Filter
    const filteredCourses = courses.filter((c) =>
        [c.title, c.instructor, c.category]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    // State lưu giá cho từng course (id: price string)
    const [coursePrices, setCoursePrices] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        async function fetchPrices() {
            if (!data?.items) return;
            const prices: Record<string, string> = {};
            await Promise.all(
                data.items.map(async (course: any) => {
                    try {
                        const version = await learnerCourseVersionService.getPublishedVersionBySlug(course.slug);
                        prices[String(course.id)] = formatCourseVersionPrice(version.price);
                    } catch {
                        prices[String(course.id)] = "-";
                    }
                })
            );
            setCoursePrices(prices);
        }
        fetchPrices();
    }, [data]);

    const pagedCourses = React.useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredCourses.slice(start, start + PAGE_SIZE);
    }, [filteredCourses, page]);

    const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);

    // UI
    return (
        <div className="mx-auto max-w-7xl px-4 py-12">
            {/* HERO */}
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

            {/* CATEGORY NAVIGATION */}
            {!isLoading && categoryTree && (
                <section className="mb-14">
                    {/* Parent categories */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {categoryTree.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedParentId(cat.id);
                                    setSelectedChildId(null);
                                }}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition
            ${selectedParentId === cat.id
                                        ? "bg-emerald-500 text-white shadow"
                                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    {/* Child categories */}
                    {selectedParentId && (
                        <div className="flex gap-8 border-b border-white/10">
                            {categoryTree
                                .find(c => c.id === selectedParentId)
                                ?.children?.map(child => (
                                    <button
                                        key={child.id}
                                        onClick={() => setSelectedChildId(child.id)}
                                        className={`pb-3 text-sm font-medium transition
                ${selectedChildId === child.id
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

            {/* FEATURED COURSES BY CATEGORY */}
            {selectedParentId && selectedChildId && categoryTree && (
                <section className="mb-20">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                        Courses in this category
                    </h2>
                    {(() => {
                        const parent = categoryTree.find(c => c.id === selectedParentId);
                        const child = parent?.children?.find(c => c.id === selectedChildId);
                        if (!child) return null;
                        // Group courses by category id
                        const list = filteredCourses.filter(c => c.category === child.name);
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

            {/* ALL COURSES */}
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
                            price={coursePrices[c.id] || "-"}
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

// Helper
function mapDifficultyToLevel(
    difficulty?: string
): "Beginner" | "Intermediate" | "Advanced" {
    if (difficulty === "BEGINNER") return "Beginner";
    if (difficulty === "INTERMEDIATE") return "Intermediate";
    if (difficulty === "ADVANCED") return "Advanced";
    return "Beginner";
}