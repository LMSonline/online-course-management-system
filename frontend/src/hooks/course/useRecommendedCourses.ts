import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { useStudentEnrollments } from "@/hooks/enrollment/useStudentEnrollments";
import { useAuthStore } from "@/lib/auth/authStore";
import { useMemo } from "react";

export function useRecommendedCourses({ page = 0, size = 100 } = {}) {
  const { studentId } = useAuthStore();
  const { data: allCoursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["all-courses", { page, size }],
    queryFn: () => courseService.getCoursesActive({ page, size }),
    staleTime: 60_000,
  });
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useStudentEnrollments({
    studentId,
    page: 0,
    size: 1000,
  });
  const recommendedCourses = useMemo(() => {
    if (!allCoursesData?.items || !enrollmentsData?.items) return [];
    const enrolledCourseIds = new Set(enrollmentsData.items.map(e => e.courseId));
    return allCoursesData.items.filter(c => !enrolledCourseIds.has(c.id));
  }, [allCoursesData, enrollmentsData]);
  return {
    courses: recommendedCourses,
    isLoading: coursesLoading || enrollmentsLoading,
  };
}
