// Hooks liên quan đến tag cho learner
import { useQuery } from '@tanstack/react-query';
import { learnerTagService } from '../../services/learner/tagService';
import { Tag, TagListResponse } from '../../lib/learner/tag/tags';

/**
 * Lấy danh sách tag public (có phân trang)
 */
export function useTags(params?: Record<string, any>) {
  return useQuery<TagListResponse>({
    queryKey: ['learner-tags', params],
    queryFn: () => learnerTagService.getTags(params),
  });
}

/**
 * Lấy toàn bộ tag public (không phân trang)
 */
export function useAllTags() {
  return useQuery<Tag[]>({
    queryKey: ['learner-all-tags'],
    queryFn: () => learnerTagService.getAllTags(),
  });
}

/**
 * Tìm kiếm tag theo tên
 */
export function useSearchTags(query: string) {
  return useQuery<Tag[]>({
    queryKey: ['learner-search-tags', query],
    queryFn: () => learnerTagService.searchTags(query),
    enabled: !!query,
  });
}
