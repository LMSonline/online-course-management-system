export const API = process.env.NEXT_PUBLIC_API_BASE_URL;

function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};

  if (headers instanceof Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => (obj[key] = value));
    return obj;
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers as Record<string, string>;
}

export async function apiClient(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
) {
  let accessToken: string | null = null;

  if (!options.skipAuth && typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken");
  }

  const normalized = normalizeHeaders(options.headers);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...normalized,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || "Request failed";
    const error: any = new Error(msg);
    error.status = res.status;
    error.response = data;
    throw error;
  }

  return data;
}

/**
 * Create a new lesson in a chapter.
 * @param chapterId number
 * @param lessonData { type: 'VIDEO' | 'TEXT' | 'QUIZ', title: string, shortDescription?: string }
 */
export async function createLesson(chapterId: number, lessonData: { type: string; title: string; shortDescription?: string }) {
  return apiClient(`/api/v1/chapters/${chapterId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(lessonData),
  });
}

/**
 * Notify server of completed video upload for a lesson.
 * @param lessonId number
 * @param payload { objectKey: string, durationSeconds: number }
 */
export async function notifyLessonUploadComplete(
  lessonId: number,
  payload: { objectKey: string; durationSeconds: number }
) {
  return apiClient(`/api/v1/lessons/${lessonId}/upload-complete`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

