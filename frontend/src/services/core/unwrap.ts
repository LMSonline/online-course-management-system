

import type { ApiResponse, PageResponse } from "./api";


export function unwrapApiResponse<T>(responseData: unknown): T {
  if (responseData && typeof responseData === "object") {
    const apiResponse = responseData as ApiResponse<T>;
    if ("data" in apiResponse && "status" in apiResponse) {
      return apiResponse.data;
    }
  }
  return responseData as T;
}


export function unwrapPage<T>(responseData: unknown): PageResponse<T> {
  const unwrapped = unwrapApiResponse<PageResponse<T> | unknown>(responseData);
  
  if (unwrapped && typeof unwrapped === "object") {
    const pageResponse = unwrapped as PageResponse<T>;
    if ("items" in pageResponse || "content" in pageResponse) {
      const items = (pageResponse as { items?: T[]; content?: T[] }).items || 
                    (pageResponse as { items?: T[]; content?: T[] }).content || 
                    [];
      
      return {
        items,
        page: pageResponse.page ?? 0,
        size: pageResponse.size ?? 10,
        totalItems: pageResponse.totalItems ?? items.length,
        totalPages: pageResponse.totalPages ?? 1,
        hasNext: pageResponse.hasNext ?? false,
        hasPrevious: pageResponse.hasPrevious ?? false,
      };
    }
  }
  
  return {
    items: [],
    page: 0,
    size: 10,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };
}

