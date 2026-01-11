// Hooks cho feedback APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerFeedbackService } from '../../services/learner/feedbackService';
import { FeedbackListResponse, FeedbackResponse } from '../../lib/learner/feedback/feedbacks';

/** Lấy danh sách feedback của student */
export function useFeedbacks(studentId: number) {
  return useQuery<FeedbackListResponse>({
    queryKey: ['learner-feedbacks', studentId],
    queryFn: () => learnerFeedbackService.getFeedbacks(studentId),
    enabled: !!studentId,
  });
}

/** Gửi feedback mới */
export function useSendFeedback() {
  return useMutation({
    mutationFn: ({ studentId, content, courseId }: { studentId: number; content: string; courseId?: number }) =>
      learnerFeedbackService.sendFeedback(studentId, content, courseId),
  });
}
