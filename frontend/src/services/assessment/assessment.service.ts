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
  QuestionCountResponse,
  QuestionInUseResponse,
  QuizzesUsingQuestionResponse,
  QuestionType,
} from "./assessment.types";

export const assessmentService = {
  // =================================================================
  // MODULE 1: QUIZ MANAGEMENT (Teacher - Core CRUD & Linking)
  // =================================================================

  /** #1. Create Independent Quiz */
  createIndependentQuiz: async (
    payload: QuizRequest
  ): Promise<QuizResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizResponse>>(
      `/quizzes`,
      payload
    );
    return unwrapResponse(response);
  },

  /** #5. Create Quiz & Link to Lesson (Convenience) */
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

  /** #2. Get All Independent Quizzes */
  getAllIndependentQuizzes: async (): Promise<QuizResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuizResponse[]>>(
      `/quizzes`
    );
    return unwrapResponse(response);
  },

  /** #6. Get Quizzes by Lesson */
  getQuizzesByLesson: async (lessonId: number): Promise<QuizResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuizResponse[]>>(
      `/lessons/${lessonId}/quizzes`
    );
    return unwrapResponse(response);
  },

  /** #7. Get Quiz by ID */
  getQuizById: async (id: number): Promise<QuizResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizResponse>>(
      `/quizzes/${id}`
    );
    return unwrapResponse(response);
  },

  /** #8. Update Quiz */
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

  /** #9. Delete Quiz */
  deleteQuiz: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/quizzes/${id}`
    );
    return unwrapResponse(response);
  },

  /** #12. Clone Quiz */
  cloneQuiz: async (
    id: number,
    targetLessonId: number
  ): Promise<QuizResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/clone`,
      null,
      { params: { targetLessonId } }
    );
    return unwrapResponse(response);
  },

  /** Get questions for a quiz */
  getQuizQuestions: async (quizId: number): Promise<QuestionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse[]>>(
      `/quizzes/${quizId}/questions`
    );
    return unwrapResponse(response);
  },

  /** #3. Link Quiz to Lesson */
  linkQuizToLesson: async (
    lessonId: number,
    quizId: number
  ): Promise<QuizResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizResponse>>(
      `/lessons/${lessonId}/quizzes/${quizId}`
    );
    return unwrapResponse(response);
  },

  /** #4. Unlink Quiz from Lesson */
  unlinkQuizFromLesson: async (
    lessonId: number,
    quizId: number
  ): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/lessons/${lessonId}/quizzes/${quizId}`
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 2: QUIZ CONFIGURATION (Questions & Settings)
  // =================================================================

  /** #10. Add Questions to Quiz (By IDs) */
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

  /** #17. Add Questions from Bank */
  addQuestionsFromBank: async (
    id: number,
    questionBankId: number,
    count?: number
  ): Promise<QuizResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/add-from-bank`,
      null,
      { params: { questionBankId, count } }
    );
    return unwrapResponse(response);
  },

  /** #11. Remove Question from Quiz */
  removeQuestionFromQuiz: async (
    quizId: number,
    questionId: number
  ): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/quizzes/${quizId}/questions/${questionId}`
    );
    return unwrapResponse(response);
  },

  /** #18. Remove All Questions */
  removeAllQuestions: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/quizzes/${id}/questions`
    );
    return unwrapResponse(response);
  },

  /** #13. Reorder Questions */
  reorderQuestions: async (
    id: number,
    questionIdsInOrder: number[]
  ): Promise<void> => {
    const response = await axiosClient.put<ApiResponse<void>>(
      `/quizzes/${id}/reorder-questions`,
      questionIdsInOrder
    );
    return unwrapResponse(response);
  },

  /** #14. Get Question Count */
  getQuestionCount: async (id: number): Promise<number> => {
    const response = await axiosClient.get<ApiResponse<number>>(
      `/quizzes/${id}/question-count`
    );
    return unwrapResponse(response);
  },

  /** #15. Update Time Limit */
  updateTimeLimit: async (
    id: number,
    timeLimitMinutes: number
  ): Promise<QuizResponse> => {
    const response = await axiosClient.put<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/time-limit`,
      null,
      { params: { timeLimitMinutes } }
    );
    return unwrapResponse(response);
  },

  /** #16. Update Passing Score */
  updatePassingScore: async (
    id: number,
    passingScore: number
  ): Promise<QuizResponse> => {
    const response = await axiosClient.put<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/passing-score`,
      null,
      { params: { passingScore } }
    );
    return unwrapResponse(response);
  },

  /** #19. Update Max Attempts */
  updateMaxAttempts: async (
    id: number,
    maxAttempts: number
  ): Promise<QuizResponse> => {
    const response = await axiosClient.put<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/max-attempts`,
      null,
      { params: { maxAttempts } }
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 3: QUESTION BANK MANAGEMENT
  // =================================================================

  /** #34. Create Question Bank */
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

  /** #35. Get Teacher's Question Banks */
  getQuestionBanksByTeacher: async (
    teacherId: number
  ): Promise<QuestionBankResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionBankResponse[]>>(
      `/teachers/${teacherId}/question-banks`
    );
    return unwrapResponse(response);
  },

  /** #39. Get All Question Banks (System) */
  getAllQuestionBanks: async (): Promise<QuestionBankResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionBankResponse[]>>(
      `/question-banks`
    );
    return unwrapResponse(response);
  },

  /** #36. Get Question Bank by ID */
  getQuestionBankById: async (id: number): Promise<QuestionBankResponse> => {
    const response = await axiosClient.get<ApiResponse<QuestionBankResponse>>(
      `/question-banks/${id}`
    );
    return unwrapResponse(response);
  },

  /** #37. Update Question Bank */
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

  /** #38. Delete Question Bank */
  deleteQuestionBank: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/question-banks/${id}`
    );
    return unwrapResponse(response);
  },

  /** #40. Search Question Banks */
  searchQuestionBanks: async (
    keyword: string
  ): Promise<QuestionBankResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionBankResponse[]>>(
      `/question-banks/search`,
      { params: { keyword } }
    );
    return unwrapResponse(response);
  },

  /** #41. Clone Question Bank */
  cloneQuestionBank: async (
    id: number,
    targetTeacherId: number
  ): Promise<QuestionBankResponse> => {
    const response = await axiosClient.post<ApiResponse<QuestionBankResponse>>(
      `/question-banks/${id}/clone`,
      null,
      { params: { targetTeacherId } }
    );
    return unwrapResponse(response);
  },

  /** #31. Get Question Count by Bank */
  getQuestionCountByBank: async (
    bankId: number
  ): Promise<QuestionCountResponse> => {
    const response = await axiosClient.get<ApiResponse<QuestionCountResponse>>(
      `/question-banks/${bankId}/questions/count`
    );
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 4: QUESTION MANAGEMENT
  // =================================================================

  /** #20. Create Question */
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

  /** #21. Get Questions by Bank */
  getQuestionsByBank: async (bankId: number): Promise<QuestionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse[]>>(
      `/question-banks/${bankId}/questions`
    );
    return unwrapResponse(response);
  },

  /** #22. Get Question by ID */
  getQuestionById: async (id: number): Promise<QuestionResponse> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse>>(
      `/questions/${id}`
    );
    return unwrapResponse(response);
  },

  /** #23. Update Question */
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

  /** #24. Delete Question */
  deleteQuestion: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/questions/${id}`
    );
    return unwrapResponse(response);
  },

  /** #29. Bulk Delete Questions */
  bulkDeleteQuestions: async (questionIds: number[]): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/questions/bulk`,
      { data: questionIds }
    );
    return unwrapResponse(response);
  },

  /** #28. Clone Question */
  cloneQuestion: async (
    id: number,
    targetBankId: number
  ): Promise<QuestionResponse> => {
    const response = await axiosClient.post<ApiResponse<QuestionResponse>>(
      `/questions/${id}/clone`,
      null,
      { params: { targetBankId } }
    );
    return unwrapResponse(response);
  },

  /** #25. Manage Answer Options */
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

  /** #30. Update Max Points */
  updateMaxPoints: async (
    id: number,
    maxPoints: number
  ): Promise<QuestionResponse> => {
    const response = await axiosClient.put<ApiResponse<QuestionResponse>>(
      `/questions/${id}/max-points`,
      null,
      { params: { maxPoints } }
    );
    return unwrapResponse(response);
  },

  /** #26. Search Questions in Bank */
  searchQuestions: async (
    bankId: number,
    keyword: string
  ): Promise<QuestionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse[]>>(
      `/question-banks/${bankId}/questions/search`,
      { params: { keyword } }
    );
    return unwrapResponse(response);
  },

  /** #27. Get Questions by Type */
  getQuestionsByType: async (
    bankId: number,
    type: QuestionType
  ): Promise<QuestionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuestionResponse[]>>(
      `/question-banks/${bankId}/questions/by-type`,
      { params: { type } }
    );
    return unwrapResponse(response);
  },

  /** #32. Check Question In Use */
  checkQuestionInUse: async (id: number): Promise<QuestionInUseResponse> => {
    const response = await axiosClient.get<ApiResponse<QuestionInUseResponse>>(
      `/questions/${id}/in-use`
    );
    return unwrapResponse(response);
  },

  /** #33. Get Quizzes Using Question */
  getQuizzesUsingQuestion: async (
    id: number
  ): Promise<QuizzesUsingQuestionResponse> => {
    const response = await axiosClient.get<
      ApiResponse<QuizzesUsingQuestionResponse>
    >(`/questions/${id}/quizzes`);
    return unwrapResponse(response);
  },

  // =================================================================
  // MODULE 5: QUIZ ATTEMPTS & RESULTS (Student & Teacher)
  // =================================================================

  /** #41. Start Quiz (Student) */
  startQuiz: async (quizId: number): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/start`
    );
    return unwrapResponse(response);
  },

  /** #43. Submit Answer (Student) */
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

  /** #44. Finish Quiz (Student) */
  finishQuiz: async (
    quizId: number,
    attemptId: number
  ): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/attempts/${attemptId}/finish`
    );
    return unwrapResponse(response);
  },

  /** #45. Abandon Attempt (Student) */
  abandonQuizAttempt: async (
    quizId: number,
    attemptId: number
  ): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.post<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/attempts/${attemptId}/abandon`
    );
    return unwrapResponse(response);
  },

  /** #42. Get Quiz Attempt Detail (Shared) */
  getQuizAttempt: async (
    quizId: number,
    attemptId: number
  ): Promise<QuizAttemptResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizAttemptResponse>>(
      `/quizzes/${quizId}/attempts/${attemptId}`
    );
    return unwrapResponse(response);
  },

  /** #46. Get Student's All Attempts */
  getStudentQuizAttempts: async (
    studentId: number
  ): Promise<QuizAttemptResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuizAttemptResponse[]>>(
      `/students/${studentId}/quiz-attempts`
    );
    return unwrapResponse(response);
  },

  /** #47. Get Student's Attempts by Quiz */
  getStudentQuizAttemptsByQuiz: async (
    studentId: number,
    quizId: number
  ): Promise<QuizAttemptResponse[]> => {
    const response = await axiosClient.get<ApiResponse<QuizAttemptResponse[]>>(
      `/students/${studentId}/quizzes/${quizId}/attempts`
    );
    return unwrapResponse(response);
  },

  /** #18. Get Quiz for Taking (Student View) */
  getQuizForTaking: async (id: number): Promise<QuizResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizResponse>>(
      `/quizzes/${id}/for-taking`
    );
    return unwrapResponse(response);
  },

  /** #19. Check Quiz Eligibility (Student) */
  checkQuizEligibility: async (
    id: number
  ): Promise<QuizEligibilityResponse> => {
    const response = await axiosClient.get<
      ApiResponse<QuizEligibilityResponse>
    >(`/quizzes/${id}/eligibility`);
    return unwrapResponse(response);
  },

  /** #42. Get Quiz Results (Teacher View - All students) */
  getQuizResults: async (id: number): Promise<QuizResultResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizResultResponse>>(
      `/quizzes/${id}/results`
    );
    return unwrapResponse(response);
  },

  /** #43. Get Quiz Statistics (Teacher View) */
  getQuizStatistics: async (id: number): Promise<QuizStatisticsResponse> => {
    const response = await axiosClient.get<ApiResponse<QuizStatisticsResponse>>(
      `/quizzes/${id}/statistics`
    );
    return unwrapResponse(response);
  },
};
