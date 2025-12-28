import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseVersionService } from "@/services/courses/course-version.service";
import { CourseVersionResponse } from "@/services/courses/course.types";
import { RejectRequest } from "@/services/account/account.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to approve version
 * Contract Key: VERSION_APPROVE_ACTION
 */
export function useApproveVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseVersionResponse,
    Error,
    { courseId: number; versionId: number }
  >({
    mutationFn: ({ courseId, versionId }) =>
      courseVersionService.approveCourseVersion(courseId, versionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_DETAIL, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_LIST, { courseId: variables.courseId }],
      });
      toast.success("Version approved successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve version");
    },
  });
}

/**
 * Hook to reject version
 * Contract Key: VERSION_REJECT_ACTION
 */
export function useRejectVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseVersionResponse,
    Error,
    { courseId: number; versionId: number; payload: RejectRequest }
  >({
    mutationFn: ({ courseId, versionId, payload }) =>
      courseVersionService.rejectCourseVersion(courseId, versionId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_DETAIL, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.VERSION_GET_LIST, { courseId: variables.courseId }],
      });
      toast.success("Version rejected");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject version");
    },
  });
}

