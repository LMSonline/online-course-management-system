import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { CourseResponse } from "@/services/courses/course.types";
import { PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

export interface TeacherCoursesFilters {
  page?: number;
  size?: number;
  filter?: string;
  status?:
    | "all"
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "ARCHIVED";
}

export const useTeacherCourses = (filters: TeacherCoursesFilters = {}) => {
  const queryClient = useQueryClient();

  const {
    data: coursesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PageResponse<CourseResponse>>({
    queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES, filters],
    queryFn: async () => {
      const result = await courseService.getMyCourses(
        filters.page,
        filters.size,
        filters.filter
      );
      return result;
    },
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Mutation for closing a course
  const closeCourse = useMutation({
    mutationFn: (courseId: number) => courseService.closeCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      toast.success("Course closed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to close course");
    },
  });

  // Mutation for opening a course
  const openCourse = useMutation({
    mutationFn: (courseId: number) => courseService.openCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      toast.success("Course opened successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to open course");
    },
  });

  // Mutation for deleting a course
  const deleteCourse = useMutation({
    mutationFn: (courseId: number) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      toast.success("Course deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete course");
    },
  });

  // Mutation for restoring a course
  const restoreCourse = useMutation({
    mutationFn: (courseId: number) => courseService.restoreCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      toast.success("Course restored successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to restore course");
    },
  });

  // Calculate stats from courses data
  const stats = {
    totalCourses: coursesData?.totalItems || 0,
    published: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
  };

  // Filter courses based on status filter
  let courses = coursesData?.items || [];
  if (filters.status && filters.status !== "all") {
    // Note: Since backend doesn't expose status in CourseResponse,
    // we'll need to handle this on the frontend or request backend enhancement
    courses = courses;
  }

  return {
    courses,
    coursesData,
    stats,
    isLoading,
    isError,
    error,
    refetch,
    mutations: {
      closeCourse,
      openCourse,
      deleteCourse,
      restoreCourse,
    },
  };
};
