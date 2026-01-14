// ===========================
// Quiz Types
// ===========================

export interface QuizRequest {
  title: string;
  description?: string;
  totalPoints?: number;       // Mới thêm
  timeLimitMinutes?: number;
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  passingScore?: number;
  startDate?: string;         // Mới thêm (ISO 8601)
  endDate?: string;           // Mới thêm (ISO 8601)
}

// Map với QuizQuestionResponse bên Backend
export interface QuizQuestionResponse {
  id: number;
  questionId: number;
  questionContent: string;
  questionType: QuestionType;
  points?: number;
  orderIndex: number;
}

export interface QuizResponse {
  id: number;
  title: string;
  description?: string;
  lessonId?: number;
  totalPoints?: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  passingScore?: number;
  
  // Thời gian & Khả dụng (Mới)
  startDate?: string;         // Instant -> string
  endDate?: string;           // Instant -> string
  isAvailable?: boolean;
  availabilityMessage?: string;

  // Nội dung
  questions?: QuizQuestionResponse[]; // Đổi tên từ QuizQuestionSummary
  
  // Audit (Mới)
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
}

// ===========================
// Question Types
// ===========================

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTI_SELECT"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "ESSAY";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface AnswerOptionRequest {
  content: string;
  isCorrect: boolean;
  orderIndex?: number;
}

export interface AnswerOptionResponse {
  id: number;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface QuestionRequest {
  content: string;
  type: QuestionType;
  metadata?: string;
  maxPoints?: number;
  answerOptions?: AnswerOptionRequest[];
}

export interface QuestionResponse {
  id: number;
  content: string;
  type: QuestionType;
  metadata?: string;
  maxPoints: number;
  questionBankId: number;
  answerOptions?: AnswerOptionResponse[];
  createdAt: string;
  updatedAt: string;
}

// ===========================
// Question Bank Types
// ===========================

export interface QuestionBankRequest {
  name: string;
  description?: string;
}

export interface QuestionBankResponse {
  id: number;
  name: string;
  description?: string;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

// ===========================
// Quiz Attempt Types
// ===========================

export type QuizAttemptStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "EXPIRED";

export interface QuizAttemptResponse {
  id: number;
  quizId: number;
  quizTitle?: string;
  studentId: number;
  studentName?: string;
  attemptNumber: number;
  status: QuizAttemptStatus;
  startedAt: string;
  completedAt?: string;
  score?: number;
  totalPoints?: number;
  passed?: boolean;
  timeSpent?: number;
  answers?: QuizAnswerResponse[];
}

export interface QuizAnswerResponse {
  questionId: number;
  questionText?: string;
  selectedOptionId?: number;
  textAnswer?: string;
  correct?: boolean;
  pointsEarned?: number;
}

export interface SubmitAnswerRequest {
  questionId: number;
  selectedOptionId?: number;
  textAnswer?: string;
}

export interface AddQuestionsRequest {
  questionIds: number[];
}

export interface QuizResultResponse {
  quizId: number;
  quizTitle: string;
  totalAttempts: number;
  averageScore: number;
  passingRate: number;
  studentResults: StudentQuizResultResponse[];
}

export interface StudentQuizResultResponse {
  studentId: number;
  studentName: string;
  studentCode?: string;
  attempts: number;
  bestScore?: number;
  lastAttemptAt?: string;
  passed: boolean;
}

// ===========================
// Quiz Eligibility & Statistics Types
// ===========================

// Cập nhật hoàn toàn theo DTO backend
export interface QuizEligibilityResponse {
  quizId: number;
  quizTitle: string;
  canAttempt: boolean;        // Map từ backend field: canAttempt
  currentAttempts: number;
  maxAttempts?: number;
  remainingAttempts: number;
  reason?: string;
  isAvailable: boolean;
  startDate?: string;
  endDate?: string;
  availabilityMessage?: string;
}

export interface QuizStatisticsResponse {
  quizId: number;
  quizTitle: string;
  totalAttempts: number;
  totalStudents: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passingRate: number;
  averageTimeSpent?: number;
}

// ===========================
// Additional Response Types
// ===========================

export interface QuestionCountResponse {
  count: number;
}

export interface QuestionInUseResponse {
  inUse: boolean;
}

export interface QuizzesUsingQuestionResponse {
  quizIds: number[];
}