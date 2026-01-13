// Service cho quiz APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { QuizListResponse, QuizDetailResponse, QuizSubmissionResponse } from '@/lib/learner/quiz/quizzes';

export const learnerQuizService = {
  /** Lấy danh sách quiz của student */
  getQuizzes: async (studentId: number): Promise<QuizListResponse> => {
    const res = await axiosClient.get(`/students/${studentId}/quizzes`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết quiz và câu hỏi */
  getQuizDetail: async (quizId: number): Promise<QuizDetailResponse> => {
    const res = await axiosClient.get(`/quizzes/${quizId}`);
    return unwrapResponse(res);
  },

  /** Lấy submission của student cho quiz */
  getSubmission: async (quizId: number, studentId: number): Promise<QuizSubmissionResponse> => {
    const res = await axiosClient.get(`/quizzes/${quizId}/submissions/${studentId}`);
    return unwrapResponse(res);
  },

  /** Nộp bài quiz */
  submitQuiz: async (quizId: number, studentId: number, answers: Array<{ questionId: number; selectedOptionId: number }>): Promise<QuizSubmissionResponse> => {
    const res = await axiosClient.post(`/quizzes/${quizId}/submissions`, {
      studentId,
      answers,
    });
    return unwrapResponse(res);
  },
};
