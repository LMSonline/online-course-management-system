"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { PageResponse } from "@/lib/api/api.types";
import { RejectRequest } from "@/services/account";
import { courseReviewService } from "@/services/courses/course-review.service";
import {
  CourseVersionResponse,
} from "@/services/courses/course.types";
import { toast } from "sonner";

interface GetAllCoursesParams {
  page?: number;
  size?: number;
  searchQuery?: string;
}

interface GetPendingVersionsParams {
  page?: number;
  size?: number;
}

export const useGetAllCourses = (params: GetAllCoursesParams) => {
  return useQuery({
    queryKey: ["courses", "all", params],
    queryFn: async () => {
      const response = await courseService.getAllCourses(params.page, params.size);
      return response;
    },
  });
};
// export const useGetAllCourses = (params: GetAllCoursesParams) => {
//   return useQuery<PageResponse<AdminCourseResponse>>({
//     queryKey: ["courses", "admin", params],
//     queryFn: () =>
//       courseService.getAllCourses(params.page, params.size),
//   });
// };


export const useGetPendingVersions = (params: GetPendingVersionsParams) => {
  return useQuery({
    queryKey: ["versions", "pending", params],
    queryFn: async () => {
      const response = await courseVersionService.getAllPendingCourseVersions(
        params.page,
        params.size
      );
      return response;
    },
  });
};


// export const useGetPendingVersions = (params: GetPendingVersionsParams) => {
//   return useQuery<PageResponse<AdminPendingCourseVersion>>({
//     queryKey: ["versions", "pending", params],
//     queryFn: async () => {
//       return await courseVersionService.getAllPendingCourseVersions(
//         params.page,
//         params.size
//       );
//     },
//   });
// };


export const useGetVersionDetail = (courseId: number, versionId: number) => {
  return useQuery({
    queryKey: ["version", courseId, versionId],
    queryFn: async () => {
      const response = await courseVersionService.getCourseVersionById(
        courseId,
        versionId
      );
      return response;
    },
  });
};

export const useApproveVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      versionId,
    }: {
      courseId: number;
      versionId: number;
    }) => {
      return await courseVersionService.approveCourseVersion(courseId, versionId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["versions", "pending"] });
      queryClient.invalidateQueries({
        queryKey: ["version", variables.courseId, variables.versionId],
      });

      toast.success("Course version approved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to approve course version");
    },
  });
};



export const useRejectVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      versionId,
      reason,
    }: {
      courseId: number;
      versionId: number;
      reason: string;
    }) => {
      const payload: RejectRequest = { reason };
      return await courseVersionService.rejectCourseVersion(
        courseId,
        versionId,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["versions", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["version", variables.courseId, variables.versionId],
      });

      toast.success("Course version rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reject course version");
    },
  });
};


export const usePublishVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, versionId }: { courseId: number; versionId: number }) => {
      return await courseVersionService.publishCourseVersion(courseId, versionId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["versions", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["version", variables.courseId, variables.versionId],
      });
    },
  });
};



export const useAdminCourseReviews = (
  courseId: number,
  page = 0,
  size = 5
) => {
  return useQuery({
    queryKey: ["admin-course-reviews", courseId, page, size],
    queryFn: () =>
      courseReviewService.getCourseReviews(courseId, page, size),
    enabled: !!courseId,
  });
};

export const useAdminCourseRatingSummary = (courseId: number) => {
  return useQuery({
    queryKey: ["admin-course-rating-summary", courseId],
    queryFn: () =>
      courseReviewService.getRatingSummary(courseId),
    enabled: !!courseId,
  });
};
// ================= COURSE VERSIONS BY COURSE (ADMIN VIEW) =================

export const useCourseVersionsByCourse = (
  courseId: number,
  enabled = false
) => {
  return useQuery({
    queryKey: ["course-versions", courseId],
    queryFn: async () => {
      return await courseVersionService.getCourseVersions(courseId);
    },
    enabled: enabled && !!courseId, //  chỉ fetch khi expand
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};
