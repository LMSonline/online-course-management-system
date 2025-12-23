/**
 * Recommendation service - handles course recommendations
 * Note: Uses root path `/` instead of `/api/v1`
 */

import axios from "axios";
import { USE_MOCK } from "@/config/runtime";
import { unwrapApiResponse } from "@/services/core/unwrap";

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

  const response = await axios.get<ApiResponse<Recommendation[]>>(
    `${RECOMMENDATION_BASE_URL}/students/${studentId}/recommendations`
  );
  return unwrapApiResponse<Recommendation[]>(response.data);
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

  await axios.post(`${RECOMMENDATION_BASE_URL}/recommendations/${recommendationId}/feedback`, feedback);
}

