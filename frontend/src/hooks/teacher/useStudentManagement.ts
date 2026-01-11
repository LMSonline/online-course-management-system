import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/learning/enrollment.service";
import { userService } from "@/services/user/user.service";
import { toast } from "sonner";

/**
 * Hook to get course enrollments for teacher
 */
export function useCourseEnrollments(courseId?: number, page = 0, size = 100) {
  return useQuery({
    queryKey: ["course-enrollments", courseId, page, size],
    queryFn: () => {
      if (!courseId) throw new Error("Course ID is required");
      return enrollmentService.getCourseEnrollments(courseId, page, size);
    },
    enabled: !!courseId,
  });
}

/**
 * Hook to get enrollment statistics for a course
 */
export function useCourseEnrollmentStats(courseId?: number) {
  return useQuery({
    queryKey: ["enrollment-stats", courseId],
    queryFn: () => {
      if (!courseId) throw new Error("Course ID is required");
      return enrollmentService.getEnrollmentStats(courseId);
    },
    enabled: !!courseId,
  });
}

/**
 * Hook to get student details
 */
export function useStudentDetail(studentId?: number) {
  return useQuery({
    queryKey: ["student-detail", studentId],
    queryFn: () => {
      if (!studentId) throw new Error("Student ID is required");
      return userService.getStudentById(studentId);
    },
    enabled: !!studentId,
  });
}

/**
 * Hook to get student's enrolled courses
 */
export function useStudentCourses(studentId?: number, page = 0, size = 50) {
  return useQuery({
    queryKey: ["student-courses", studentId, page, size],
    queryFn: () => {
      if (!studentId) throw new Error("Student ID is required");
      return userService.getStudentCourses(studentId, page, size);
    },
    enabled: !!studentId,
  });
}

/**
 * Hook to get enrollment detail
 */
export function useEnrollmentDetail(enrollmentId?: number) {
  return useQuery({
    queryKey: ["enrollment-detail", enrollmentId],
    queryFn: () => {
      if (!enrollmentId) throw new Error("Enrollment ID is required");
      return enrollmentService.getEnrollmentDetail(enrollmentId);
    },
    enabled: !!enrollmentId,
  });
}

/**
 * Hook to complete enrollment (Teacher only)
 */
export function useCompleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: number) =>
      enrollmentService.completeEnrollment(enrollmentId),
    onSuccess: (_, enrollmentId) => {
      toast.success("Enrollment marked as completed");
      queryClient.invalidateQueries({ queryKey: ["course-enrollments"] });
      queryClient.invalidateQueries({
        queryKey: ["enrollment-detail", enrollmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["enrollment-stats"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to complete enrollment");
    },
  });
}

/**
 * Hook to export course enrollments
 * Note: Export functionality may not be available yet in backend
 */
export function useExportEnrollments() {
  return useMutation({
    mutationFn: async ({
      courseId,
      format = "CSV",
    }: {
      courseId: number;
      format?: "CSV" | "EXCEL";
    }) => {
      // TODO: Implement export when backend endpoint is ready
      // For now, return mock data
      const enrollments = await enrollmentService.getCourseEnrollments(
        courseId,
        0,
        1000
      );

      // Convert to CSV
      const headers = [
        "Student Name",
        "Email",
        "Status",
        "Progress",
        "Enrolled At",
        "Completed Lessons",
        "Total Lessons",
      ];
      const rows = enrollments.items.map((e: any) => [
        e.studentName || "",
        e.studentEmail || "",
        e.status || "",
        `${e.progress || 0}%`,
        e.enrolledAt || "",
        e.completedLessons || 0,
        e.totalLessons || 0,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    },
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `enrollments-course-${variables.courseId}.${
        variables.format?.toLowerCase() || "csv"
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Enrollments exported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to export enrollments");
    },
  });
}
