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
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface AnswerOptionRequest {
  optionText: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface AnswerOptionResponse {
  id: number;
  optionText: string;
  isCorrect: boolean;
  explanation?: string;
  order: number;
}

export interface QuestionRequest {
  questionText: string;
  questionType: QuestionType;
  difficulty?: QuestionDifficulty;
  points?: number;
  explanation?: string;
  answerOptions?: AnswerOptionRequest[];
}

export interface QuestionResponse {
  id: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  points: number;
  explanation?: string;
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
  subject?: string;
  isPublic?: boolean;
}

export interface QuestionBankResponse {
  id: number;
  name: string;
  description?: string;
  subject?: string;
  teacherId: number;
  teacherName?: string;
  isPublic: boolean;
  totalQuestions?: number;
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
  isCorrect?: boolean;
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
