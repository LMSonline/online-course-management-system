/**
 * Recommendation service - handles course recommendations
 * Note: Uses root path `/` instead of `/api/v1`
 */

import { USE_MOCK } from "@/config/runtime";
import { unwrapApiResponse } from "@/services/core/unwrap";
import { apiClient } from "@/services/core/api";
import { getAccessToken } from "@/services/core/token";

const RECOMMENDATION_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8080";

export interface Recommendation {
  id: number;
  courseId: number;
  courseTitle: string;
  courseSlug: string;
  thumbnailUrl: string;
  reason: string;
  score: number;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  code?: string;
  data: T;
  timestamp?: string;
}

/**
 * Get recommendations for a student
 * Note: This endpoint uses root path `/` instead of `/api/v1`
 */
export async function getRecommendations(studentId: number): Promise<Recommendation[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const token = getAccessToken();
  if (!token) {
    return [];
  }

  try {
    const response = await apiClient.get<ApiResponse<Recommendation[]>>(
      `${RECOMMENDATION_BASE_URL}/students/${studentId}/recommendations`
    );
    return unwrapApiResponse<Recommendation[]>(response.data);
  } catch (err) {
    console.error("[Recommendation] Failed to fetch, returning empty:", err);
    return [];
  }
}

/**
 * Submit feedback for a recommendation
 */
export async function submitRecommendationFeedback(
  recommendationId: number,
  feedback: { liked: boolean; reason?: string }
): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }

  const token = getAccessToken();
  if (!token) return;

  try {
    await apiClient.post(
      `${RECOMMENDATION_BASE_URL}/recommendations/${recommendationId}/feedback`,
      feedback
    );
  } catch (err) {
    console.error("[Recommendation] submit feedback failed:", err);
  }
}

