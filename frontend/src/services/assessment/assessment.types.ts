// ===========================
// Quiz Types
// ===========================

export type QuizType = "PRACTICE" | "GRADED" | "FINAL";
export type QuizStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface QuizRequest {
  title: string;
  description?: string;
  instructions?: string;
  quizType: QuizType;
  timeLimit?: number; // in minutes
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  showCorrectAnswers?: boolean;
  status?: QuizStatus;
}

export interface QuizResponse {
  id: number;
  title: string;
  description?: string;
  instructions?: string;
  lessonId: number;
  lessonTitle?: string;
  courseId?: number;
  courseTitle?: string;
  teacherId?: number;
  teacherName?: string;
  quizType: QuizType;
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  status: QuizStatus;
  totalQuestions?: number;
  createdAt: string;
  updatedAt: string;
}

// ===========================
// Question Types
// ===========================

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTI_SELECT"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface AnswerOptionRequest {
  content: string;
  correct: boolean;
  orderIndex?: number;
}

export interface AnswerOptionResponse {
  id: number;
  content: string;
  correct: boolean;
  orderIndex: number;
}

export interface QuestionRequest {
  content: string;
  type: QuestionType;
  metadata?: string; // JSON string for additional data like difficulty
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
  timeSpent?: number; // in seconds
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
