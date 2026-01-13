// Service cho discussion APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { DiscussionListResponse, DiscussionDetailResponse, DiscussionCommentResponse } from '@/lib/learner/discussion/discussions';

export const learnerDiscussionService = {
  /** Lấy danh sách discussion của course */
  getDiscussions: async (courseId: number): Promise<DiscussionListResponse> => {
    const res = await axiosClient.get(`/courses/${courseId}/discussions`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết discussion và comment */
  getDiscussionDetail: async (discussionId: number): Promise<DiscussionDetailResponse> => {
    const res = await axiosClient.get(`/discussions/${discussionId}`);
    return unwrapResponse(res);
  },

  /** Tạo mới discussion */
  createDiscussion: async (courseId: number, studentId: number, title: string, content: string): Promise<DiscussionDetailResponse> => {
    const res = await axiosClient.post(`courses/${courseId}/discussions`, {
      studentId,
      title,
      content,
    });
    return unwrapResponse(res);
  },

  /** Thêm comment vào discussion */
  addComment: async (discussionId: number, studentId: number, content: string): Promise<DiscussionCommentResponse> => {
    const res = await axiosClient.post(`/discussions/${discussionId}/comments`, {
      studentId,
      content,
    });
    return unwrapResponse(res);
  },
};
