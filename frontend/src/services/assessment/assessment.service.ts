import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  QuizRequest,
  QuizResponse,
  QuestionRequest,
  QuestionResponse,
  QuestionBankRequest,
  QuestionBankResponse,
  QuizAttemptResponse,
  SubmitAnswerRequest,
  AddQuestionsRequest,
  AnswerOptionRequest,
  QuizResultResponse,
  QuizEligibilityResponse,
  QuizStatisticsResponse,
} from "./assessment.types";

export const assessmentService = {
  // ===========================
  // Quiz APIs
  // ===========================

  /**
   * Create quiz (Teacher only)
   */
  createQuiz: async (
    lessonId: number,
    payload: QuizRequest
  ): Promise<QuizResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizResponse>>(
      `/lessons/${lessonId}/quizzes`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Get quizzes by lesson
   */
  getQuizzesByLesson: async (lessonId: number): Promise<QuizResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuizResponse[]>>(
      `/lessons/${lessonId}/quizzes`
    );
    return unwrapResponse(response);
  },

  /**
   * Get quiz by ID
   */
  getQuizById: async (id: number): Promise<QuizResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizResponse>>(
      `/quizzes/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Update quiz (Teacher only)
   */
  updateQuiz: async (
    id: number,
    payload: QuizRequest
  ): Promise<QuizResponse> => {
    const response = await axiosClient.put<ApiResponse<QuizResponse>>(
      `/quizzes/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Delete quiz (Teacher only)
   */
  deleteQuiz: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/quizzes/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Add questions to quiz (Teacher only)
   */
  addQuestionsToQuiz: async (
    id: number,
    payload: AddQuestionsRequest
  ): Promise<QuizResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/add-questions`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Remove question from quiz (Teacher only)
   */
  removeQuestionFromQuiz: async (
    quizId: number,
    questionId: number
  ): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/quizzes/${quizId}/questions/${questionId}`
    );
    return unwrapResponse(response);
  },

  /**
   * Get quiz results (Teacher only)
   */
  getQuizResults: async (id: number): Promise<QuizResultResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizResultResponse>>(
      `/quizzes/${id}/results`
    );
    return unwrapResponse(response);
  },

  /**
   * Check quiz eligibility (Student only)
   */
  checkQuizEligibility: async (
    id: number
  ): Promise<QuizEligibilityResponse> => {
    const response = await axiosClient.get<
      ApiResponse<QuizEligibilityResponse>
    >(`/quizzes/${id}/eligibility`);
    return unwrapResponse(response);
  },

  /**
   * Get quiz statistics (Teacher only)
   */
  getQuizStatistics: async (id: number): Promise<QuizStatisticsResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizStatisticsResponse>>(
      `/quizzes/${id}/statistics`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Question APIs
  // ===========================

  /**
   * Create question (Teacher only)
   */
  createQuestion: async (
    bankId: number,
    payload: QuestionRequest
  ): Promise<QuestionResponse> => {
    const response = await axiosClient.post<ApiResponse<QuestionResponse>>(
      `/question-banks/${bankId}/questions`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Get questions by bank (Teacher only)
   */
  getQuestionsByBank: async (bankId: number): Promise<QuestionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse[]>>(
      `/question-banks/${bankId}/questions`
    );
    return unwrapResponse(response);
  },

  /**
   * Get question by ID (Teacher only)
   */
  getQuestionById: async (id: number): Promise<QuestionResponse> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse>>(
      `/questions/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Update question (Teacher only)
   */
  updateQuestion: async (
    id: number,
    payload: QuestionRequest
  ): Promise<QuestionResponse> => {
    const response = await axiosClient.put<ApiResponse<QuestionResponse>>(
      `/questions/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Delete question (Teacher only)
   */
  deleteQuestion: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/questions/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Manage answer options (Teacher only)
   */
  manageAnswerOptions: async (
    questionId: number,
    payload: AnswerOptionRequest[]
  ): Promise<QuestionResponse> => {
    const response = await axiosClient.post<ApiResponse<QuestionResponse>>(
      `/questions/${questionId}/answer-options`,
      payload
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Question Bank APIs
  // ===========================

  /**
   * Create question bank (Teacher only)
   */
  createQuestionBank: async (
    teacherId: number,
    payload: QuestionBankRequest
  ): Promise<QuestionBankResponse> => {
    const response = await axiosClient.post<ApiResponse<QuestionBankResponse>>(
      `/teachers/${teacherId}/question-banks`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Get question banks by teacher (Teacher only)
   */
  getQuestionBanksByTeacher: async (
    teacherId: number
  ): Promise<QuestionBankResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionBankResponse[]>>(
      `/teachers/${teacherId}/question-banks`
    );
    return unwrapResponse(response);
  },

  /**
   * Get question bank by ID (Teacher only)
   */
  getQuestionBankById: async (id: number): Promise<QuestionBankResponse> => {
    const response = await axiosClient.get<ApiResponse<QuestionBankResponse>>(
      `/question-banks/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Update question bank (Teacher only)
   */
  updateQuestionBank: async (
    id: number,
    payload: QuestionBankRequest
  ): Promise<QuestionBankResponse> => {
    const response = await axiosClient.put<ApiResponse<QuestionBankResponse>>(
      `/question-banks/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Delete question bank (Teacher only)
   */
  deleteQuestionBank: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/question-banks/${id}`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Quiz Attempt APIs
  // ===========================

  /**
   * Start quiz (Student only)
   */
  startQuiz: async (quizId: number): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/start`
    );
    return unwrapResponse(response);
  },

  /**
   * Get quiz attempt
   */
  getQuizAttempt: async (
    quizId: number,
    attemptId: number
  ): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/attempts/${attemptId}`
    );
    return unwrapResponse(response);
  },

  /**
   * Submit answer (Student only)
   */
  submitAnswer: async (
    quizId: number,
    attemptId: number,
    payload: SubmitAnswerRequest
  ): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `/quizzes/${quizId}/attempts/${attemptId}/submit-answer`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Finish quiz (Student only)
   */
  finishQuiz: async (
    quizId: number,
    attemptId: number
  ): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/attempts/${attemptId}/finish`
    );
    return unwrapResponse(response);
  },

  /**
   * Get student quiz attempts
   */
  getStudentQuizAttempts: async (
    studentId: number
  ): Promise<QuizAttemptResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuizAttemptResponse[]>>(
      `/students/${studentId}/quiz-attempts`
    );
    return unwrapResponse(response);
  },
};
