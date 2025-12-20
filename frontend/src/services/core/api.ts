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

