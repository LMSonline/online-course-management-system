// Service cho assignment APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Assignment, AssignmentSubmission, AssignmentListResponse, AssignmentSubmissionResponse } from '@/lib/learner/assignment/assignments';

export const learnerAssignmentService = {
  /** Lấy danh sách assignment của student */
  getAssignments: async (studentId: number): Promise<AssignmentListResponse> => {
    const res = await axiosClient.get(`/students/${studentId}/assignments`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết assignment */
  getAssignmentDetail: async (assignmentId: number): Promise<Assignment> => {
    const res = await axiosClient.get(`/assignments/${assignmentId}`);
    return unwrapResponse(res);
  },

  /** Lấy submission của student cho assignment */
  getSubmission: async (assignmentId: number, studentId: number): Promise<AssignmentSubmissionResponse> => {
    const res = await axiosClient.get(`/assignments/${assignmentId}/submissions/${studentId}`);
    return unwrapResponse(res);
  },

  /** Nộp bài assignment */
  submitAssignment: async (assignmentId: number, studentId: number, content: string): Promise<AssignmentSubmissionResponse> => {
    const res = await axiosClient.post(`/assignments/${assignmentId}/submissions`, {
      studentId,
      content,
    });
    return unwrapResponse(res);
  },
};
