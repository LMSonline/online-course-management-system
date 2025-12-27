"use client";
import { useState, useMemo } from 'react';
import Link from "next/link";
import { Plus, Search, Folder, Tag, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { CourseResponse } from "@/services/courses/course.types";
import { ImprovedCourseCard } from "@/core/components/teacher/courses/ImprovedCourseCard";
import { toast } from "sonner";

export default function MyCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch courses
  const { data: coursesData, isLoading, refetch } = useQuery({
    queryKey: ["teacher-courses", currentPage, searchQuery],
    queryFn: () => courseService.getMyCourses(currentPage, 12, searchQuery || undefined),
  });

  const courses = coursesData?.items || [];

  // Filter courses by tag and category (client-side)
  const filteredCourses = useMemo(() => {
    let result = courses;

    if (selectedTag) {
      result = result.filter((c: CourseResponse) =>
        c.tags?.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }

    if (selectedCategory) {
      result = result.filter((c: CourseResponse) =>
        c.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return result;
  }, [courses, selectedTag, selectedCategory]);

  // Extract unique tags and categories
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    courses.forEach((c: CourseResponse) => {
      c.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [courses]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    courses.forEach((c: CourseResponse) => {
      if (c.categoryName) categories.add(c.categoryName);
    });
    return Array.from(categories);
  }, [courses]);

  // Handle actions
  const handleDelete = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseService.deleteCourse(courseId);
      toast.success('Course deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete course');
    }
  };

  const handleRestore = async (courseId: number) => {
    try {
      await courseService.restoreCourse(courseId);
      toast.success('Course restored successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to restore course');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Courses
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and track all your courses in one place
            </p>
          </div>
          <Link
            href="/teacher/create-course"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
        </div>

        {/* Stats Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {coursesData?.totalItems || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Folder className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Published</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {courses.filter((c: CourseResponse) => !c.isClosed).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {allCategories.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Tags Used</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {allTags.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: CourseResponse) => (
              <ImprovedCourseCard
                key={course.id}
                course={course}
                onDelete={handleDelete}
                onRestore={handleRestore}
                refetch={refetch}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery || selectedTag || selectedCategory
                ? "Try adjusting your filters"
                : "Get started by creating your first course"}
            </p>
            {!searchQuery && !selectedTag && !selectedCategory && (
              <Link
                href="/teacher/create-course"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Course
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {coursesData && coursesData.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {currentPage * 12 + 1} to{' '}
              {Math.min((currentPage + 1) * 12, coursesData.totalItems || 0)}{' '}
              of {coursesData.totalItems || 0} courses
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={!coursesData.hasPrevious}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                {currentPage + 1} / {coursesData.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!coursesData.hasNext}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
