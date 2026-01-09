import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "@/services/courses/tag.service";
import { TagRequest, TagResponse } from "@/services/courses/course.types";
import { PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to fetch tags (admin list)
 * Contract Key: TAG_GET_LIST
 */
export function useAdminTagsQuery(params?: { page?: number; size?: number; q?: string }) {
  return useQuery<PageResponse<TagResponse>>({
    queryKey: [CONTRACT_KEYS.TAG_GET_LIST, params],
    queryFn: () => tagService.getAllTags(params?.page, params?.size),
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to create tag
 * Contract Key: TAG_CREATE
 */
export function useCreateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation<TagResponse, Error, TagRequest>({
    mutationFn: (payload) => tagService.createTag(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TAG_GET_LIST] });
      toast.success("Tag created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create tag");
    },
  });
}

/**
 * Hook to update tag
 * Contract Key: TAG_UPDATE
 */
export function useUpdateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation<TagResponse, Error, { id: number; payload: TagRequest }>({
    mutationFn: ({ id, payload }) => tagService.updateTag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TAG_GET_LIST] });
      toast.success("Tag updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update tag");
    },
  });
}

/**
 * Hook to delete tag
 * Contract Key: TAG_DELETE
 */
export function useDeleteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TAG_GET_LIST] });
      toast.success("Tag deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete tag");
    },
  });
}

