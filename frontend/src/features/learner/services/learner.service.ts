/**
 * Learner service - handles student/learner API calls
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import type { PageResponse } from "@/services/core/api";

export interface StudentCourseResponse {
  id: number;
  courseId: number;
  courseTitle: string;
  courseSlug: string;
  thumbnailUrl: string;
  enrolledAt: string;
  progress: number;
  lastAccessedAt?: string;
}

export interface StudentProgressResponse {
  studentId: number;
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalLearningHours: number;
  achievements: string[];
}

export interface StudentCertificateResponse {
  id: number;
  courseId: number;
  courseTitle: string;
  courseSlug: string;
  issuedAt: string;
  certificateUrl: string;
}

/**
 * Get student's enrolled courses
 */
export async function getStudentCourses(
  studentId: number,
  page = 0,
  size = 10
): Promise<PageResponse<StudentCourseResponse>> {
  if (USE_MOCK) {
    return Promise.resolve({
      items: [],
      page: 0,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }

  const response = await apiClient.get<PageResponse<StudentCourseResponse>>(
    `/students/${studentId}/courses`,
    { params: { page, size } }
  );
  return response.data;
}

/**
 * Get student's learning progress
 */
export async function getStudentProgress(studentId: number): Promise<StudentProgressResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      studentId,
      totalCourses: 0,
      completedCourses: 0,
      totalLessons: 0,
      completedLessons: 0,
      totalLearningHours: 0,
      achievements: [],
    });
  }

  const response = await apiClient.get<StudentProgressResponse>(`/students/${studentId}/progress`);
  return response.data;
}

/**
 * Get student's certificates
 */
export async function getStudentCertificates(
  studentId: number,
  page = 0,
  size = 10
): Promise<PageResponse<StudentCertificateResponse>> {
  if (USE_MOCK) {
    return Promise.resolve({
      items: [],
      page: 0,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }

  const response = await apiClient.get<PageResponse<StudentCertificateResponse>>(
    `/students/${studentId}/certificates`,
    { params: { page, size } }
  );
  return response.data;
}

