import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseVersionService } from "@/services/courses/course-version.service";
import {
  CourseVersionResponse,
  CourseVersionRequest,
} from "@/services/courses/course.types";
import { toast } from "sonner";
import { RejectRequest } from "@/services/account";

export interface CourseVersionsFilters {
  courseId: number;
  status?:
    | "all"
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "ARCHIVED";
  includeDeleted?: boolean;
}

export const useCourseVersions = (filters: CourseVersionsFilters) => {
  const queryClient = useQueryClient();
  const { courseId, status, includeDeleted = false } = filters;

  // Query for course versions
  const {
    data: versionsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CourseVersionResponse[]>({
    queryKey: ["course-versions", courseId, status, includeDeleted],
    queryFn: async () => {
      if (includeDeleted) {
        return await courseVersionService.getDeletedCourseVersions(courseId);
      }

      if (status && status !== "all") {
        return await courseVersionService.getCourseVersionsByStatus(
          courseId,
          status
        );
      }

      return await courseVersionService.getCourseVersions(courseId);
    },
    enabled: !!courseId,
  });

  // Query for single version
  const getVersionById = (versionId: number) => {
    return useQuery<CourseVersionResponse>({
      queryKey: ["course-version", courseId, versionId],
      queryFn: () =>
        courseVersionService.getCourseVersionById(courseId, versionId),
      enabled: !!courseId && !!versionId,
    });
  };

  // Mutation for creating a version
  const createVersion = useMutation({
    mutationFn: (payload: CourseVersionRequest) =>
      courseVersionService.createCourseVersion(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-versions", courseId],
      });
      toast.success("Course version created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create course version");
    },
  });

  // Mutation for deleting a version
  const deleteVersion = useMutation({
    mutationFn: (versionId: number) =>
      courseVersionService.deleteCourseVersion(courseId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-versions", courseId],
      });
      toast.success("Course version deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete course version");
    },
  });

  // Mutation for submitting approval
  const submitApproval = useMutation({
    mutationFn: (versionId: number) =>
      courseVersionService.submitApproval(courseId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-versions", courseId],
      });
      toast.success("Version submitted for approval");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit for approval");
    },
  });

  // Mutation for publishing a version
  const publishVersion = useMutation({
    mutationFn: (versionId: number) =>
      courseVersionService.publishCourseVersion(courseId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-versions", courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      toast.success("Course version published successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to publish course version");
    },
  });

  // Calculate stats from versions data
  const stats = {
    total: versionsData?.length || 0,
    draft: versionsData?.filter((v) => v.status === "DRAFT").length || 0,
    pending: versionsData?.filter((v) => v.status === "PENDING").length || 0,
    approved: versionsData?.filter((v) => v.status === "APPROVED").length || 0,
    rejected: versionsData?.filter((v) => v.status === "REJECTED").length || 0,
    published:
      versionsData?.filter((v) => v.status === "PUBLISHED").length || 0,
    archived: versionsData?.filter((v) => v.status === "ARCHIVED").length || 0,
  };

  return {
    versions: versionsData || [],
    stats,
    isLoading,
    isError,
    error,
    refetch,
    getVersionById,
    mutations: {
      createVersion,
      deleteVersion,
      submitApproval,
      publishVersion,
    },
  };
};

// Hook for admin to manage pending versions
export const useAdminPendingVersions = (
  page = 0,
  size = 10,
  filter?: string
) => {
  const queryClient = useQueryClient();

  const {
    data: pendingVersionsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-pending-versions", page, size, filter],
    queryFn: () =>
      courseVersionService.getAllPendingCourseVersions(page, size, filter),
  });

  // Mutation for approving a version
  const approveVersion = useMutation({
    mutationFn: ({
      courseId,
      versionId,
    }: {
      courseId: number;
      versionId: number;
    }) => courseVersionService.approveCourseVersion(courseId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-versions"] });
      toast.success("Course version approved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to approve course version");
    },
  });

  // Mutation for rejecting a version
  const rejectVersion = useMutation({
    mutationFn: ({
      courseId,
      versionId,
      payload,
    }: {
      courseId: number;
      versionId: number;
      payload: RejectRequest;
    }) =>
      courseVersionService.rejectCourseVersion(courseId, versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-versions"] });
      toast.success("Course version rejected");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reject course version");
    },
  });

  return {
    pendingVersions: pendingVersionsData?.items || [],
    pagination: {
      currentPage: pendingVersionsData?.page || 0,
      pageSize: pendingVersionsData?.size || size,
      totalItems: pendingVersionsData?.totalItems || 0,
      totalPages: pendingVersionsData?.totalPages || 0,
      hasNext: pendingVersionsData?.hasNext || false,
      hasPrevious: pendingVersionsData?.hasPrevious || false,
    },
    isLoading,
    isError,
    error,
    refetch,
    mutations: {
      approveVersion,
      rejectVersion,
    },
  };
};
