"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { CourseResponse, CourseVersionResponse } from "@/services/courses/course.types";
import { PageResponse } from "@/lib/api/api.types";
import { RejectRequest } from "@/services/account";

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
      return await courseVersionService.rejectCourseVersion(courseId, versionId, payload);
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
