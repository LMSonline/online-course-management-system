import { useQuery } from "@tanstack/react-query";
import { tagService } from "@/services/courses/tag.service";
import { PageResponse, TagResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch tags list
 * Contract Key: TAG_GET_LIST
 */
export function useTags(page?: number, size?: number) {
  return useQuery<PageResponse<TagResponse>>({
    queryKey: [CONTRACT_KEYS.TAG_GET_LIST, page, size],
    queryFn: () => tagService.getTags(page, size),
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

