import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { CourseRequest, CourseUpdateRequest, CourseDetailResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to create course
 * Contract Key: COURSE_CREATE
 */
export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<CourseDetailResponse, Error, CourseRequest>({
    mutationFn: (payload: CourseRequest) => courseService.createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      toast.success("Course created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
}

/**
 * Hook to update course
 * Contract Key: COURSE_UPDATE
 */
export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseDetailResponse,
    Error,
    { courseId: number; payload: CourseUpdateRequest }
  >({
    mutationFn: ({ courseId, payload }) => courseService.updateCourse(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.COURSE_GET_DETAIL] });
      toast.success("Course updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
}

/**
 * Hook to toggle course status (open/close)
 * Contract Keys: COURSE_OPEN_ACTION, COURSE_CLOSE_ACTION
 */
export function useToggleCourseStatusMutation() {
  const queryClient = useQueryClient();

  const openCourse = useMutation<CourseDetailResponse, Error, number>({
    mutationFn: (courseId: number) => courseService.openCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.COURSE_GET_DETAIL] });
      toast.success("Course opened successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open course");
    },
  });

  const closeCourse = useMutation<CourseDetailResponse, Error, number>({
    mutationFn: (courseId: number) => courseService.closeCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.COURSE_GET_DETAIL] });
      toast.success("Course closed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to close course");
    },
  });

  return { openCourse, closeCourse };
}

/**
 * Hook to delete course
 * Contract Key: COURSE_DELETE
 */
export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (courseId: number) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_COURSES] });
      toast.success("Course deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
}

