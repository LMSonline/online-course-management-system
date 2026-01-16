"use client";

import { useStudentEnrollmentsWithCourses } from "@/hooks/learner/useStudentEnrollmentsWithCourses";
import MyLearningCourseCard from "@/core/components/learner/my-learning/MyLearningCourseCard";
import { useMemo, useState } from "react";
import { GraduationCap, ArrowUpDown, BookOpen, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function MyLearningPage() {
  const { courses, isLoading } = useStudentEnrollmentsWithCourses(0, 20);
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "progress-desc" | "progress-asc" | "title"
  >("newest");
  
  const sortedCourses = useMemo(() => {
    const list = [...courses];

    switch (sortBy) {
      case "oldest":
        return list.reverse(); // vì backend trả newest trước
      case "progress-desc":
        return list.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
      case "progress-asc":
        return list.sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0));
      case "title":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "newest":
      default:
        return list;
    }
  }, [courses, sortBy]);

  // Filter courses by search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return sortedCourses;
    
    const query = searchQuery.toLowerCase().trim();
    return sortedCourses.filter((course) => 
      course.title.toLowerCase().includes(query) ||
      (course.instructor && course.instructor.toLowerCase().includes(query))
    );
  }, [sortedCourses, searchQuery]);

  if (isLoading) {
    return (
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
            <GraduationCap className="w-6 h-6 text-blue-400" />
          </div>
          <div className="h-9 w-48 bg-white/5 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-white/5 overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-white/5 rounded-lg w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-2 bg-white/5 rounded-full w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
            <GraduationCap className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            My Learning
          </h1>
        </div>
        
        {/* Search Filter Badge */}
        {searchQuery && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm text-blue-300">
                Searching: <span className="font-medium">{searchQuery}</span>
              </span>
              <button
                onClick={() => router.push("/learner/my-learning")}
                className="p-1 hover:bg-blue-500/20 rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>
        )}
        
        {courses.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              {searchQuery ? (
                <>
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'result' : 'results'} 
                  {' '}for "{searchQuery}"
                </>
              ) : (
                <>
                  {courses.length} {courses.length === 1 ? 'course' : 'courses'} enrolled
                </>
              )}
            </p>

            {/* Sort Dropdown */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-xl bg-slate-900/80 backdrop-blur-sm border border-white/10 pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-slate-900"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="progress-desc">Highest Progress</option>
                <option value="progress-asc">Lowest Progress</option>
                <option value="title">Title A–Z</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? 'No results found' : 'No courses yet'}
          </h3>
          <p className="text-slate-400 max-w-sm">
            {searchQuery 
              ? `No courses match "${searchQuery}". Try a different search term.`
              : "You haven't enrolled in any courses yet. Start learning today and they'll appear here!"
            }
          </p>
        </div>
      ) : (
        /* Course Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MyLearningCourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}