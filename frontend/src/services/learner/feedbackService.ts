// Service cho feedback APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { FeedbackListResponse, FeedbackResponse } from '@/lib/learner/feedback/feedbacks';

export const learnerFeedbackService = {
  /** Lấy danh sách feedback của student */
  getFeedbacks: async (studentId: number): Promise<FeedbackListResponse> => {
    const res = await axiosClient.get(`/students/${studentId}/feedbacks`);
    return unwrapResponse(res);
  },

  /** Gửi feedback mới */
  sendFeedback: async (studentId: number, content: string, courseId?: number): Promise<FeedbackResponse> => {
    const res = await axiosClient.post(`/feedbacks`, {
      studentId,
      content,
      courseId,
    });
    return unwrapResponse(res);
  },
};
