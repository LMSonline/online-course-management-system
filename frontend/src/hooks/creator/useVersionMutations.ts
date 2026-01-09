import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseVersionService } from "@/services/courses/course-version.service";
import { CourseVersionRequest, CourseVersionResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to create course version
 * Contract Key: VERSION_CREATE
 */
export function useCreateVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseVersionResponse,
    Error,
    { courseId: number; payload: CourseVersionRequest }
  >({
    mutationFn: ({ courseId, payload }) =>
      courseVersionService.createCourseVersion(courseId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_LIST, { courseId: variables.courseId }],
      });
      toast.success("Version created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create version");
    },
  });
}

/**
 * Hook to submit version for approval
 * Contract Key: VERSION_SUBMIT_APPROVAL_ACTION
 */
export function useSubmitVersionApprovalMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseVersionResponse,
    Error,
    { courseId: number; versionId: number }
  >({
    mutationFn: ({ courseId, versionId }) =>
      courseVersionService.submitApproval(courseId, versionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_LIST, { courseId: variables.courseId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_DETAIL, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      toast.success("Version submitted for approval");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit version for approval");
    },
  });
}

/**
 * Hook to publish version
 * Contract Key: VERSION_PUBLISH_ACTION
 */
export function usePublishVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseVersionResponse,
    Error,
    { courseId: number; versionId: number }
  >({
    mutationFn: ({ courseId, versionId }) =>
      courseVersionService.publishCourseVersion(courseId, versionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_LIST, { courseId: variables.courseId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_DETAIL, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      toast.success("Version published successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish version");
    },
  });
}

