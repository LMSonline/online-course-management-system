// Hooks cho discussion APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerDiscussionService } from '../../services/learner/discussionService';
import { DiscussionListResponse, DiscussionDetailResponse, DiscussionCommentResponse } from '../../lib/learner/discussion/discussions';

/** Lấy danh sách discussion của course */
export function useDiscussions(courseId: number) {
  return useQuery<DiscussionListResponse>({
    queryKey: ['learner-discussions', courseId],
    queryFn: () => learnerDiscussionService.getDiscussions(courseId),
    enabled: !!courseId,
  });
}

/** Lấy chi tiết discussion và comment */
export function useDiscussionDetail(discussionId: number) {
  return useQuery<DiscussionDetailResponse>({
    queryKey: ['learner-discussion-detail', discussionId],
    queryFn: () => learnerDiscussionService.getDiscussionDetail(discussionId),
    enabled: !!discussionId,
  });
}

/** Tạo mới discussion */
export function useCreateDiscussion() {
  return useMutation({
    mutationFn: ({ courseId, studentId, title, content }: { courseId: number; studentId: number; title: string; content: string }) =>
      learnerDiscussionService.createDiscussion(courseId, studentId, title, content),
  });
}

/** Thêm comment vào discussion */
export function useAddDiscussionComment() {
  return useMutation({
    mutationFn: ({ discussionId, studentId, content }: { discussionId: number; studentId: number; content: string }) =>
      learnerDiscussionService.addComment(discussionId, studentId, content),
  });
}
