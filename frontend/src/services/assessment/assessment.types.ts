// ===========================
// Quiz Types
// ===========================

export interface QuizRequest {
  title: string;
  description?: string;
  timeLimitMinutes?: number | null;
  passingScore?: number | null;
  maxAttempts?: number | null;
  randomizeQuestions?: boolean | null;
  randomizeOptions?: boolean | null;
}

export interface QuizQuestionSummary {
  id: number;
  questionId: number;
  questionContent: string;
  questionType: QuestionType;
  points?: number | null;
  orderIndex: number;
}

export interface QuizResponse {
  id: number;
  title: string;
  description?: string | null;
  lessonId?: number | null;
  totalPoints?: number | null;
  timeLimitMinutes?: number | null;
  maxAttempts?: number | null;
  randomizeQuestions?: boolean | null;
  randomizeOptions?: boolean | null;
  passingScore?: number | null;
  totalQuestions?: number;
  questions?: QuizQuestionSummary[];
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
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

export interface QuizEligibilityResponse {
  eligible: boolean;
  reason?: string;
  remainingAttempts?: number;
  nextAttemptAvailable?: string;
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