// Type definitions for learner quiz APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  description: string;
  totalQuestions: number;
  durationMinutes: number;
  status: 'active' | 'completed';
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  content: string;
  options: Array<{
    id: number;
    text: string;
  }>;
  correctOptionId?: number;
}

export interface QuizSubmission {
  quizId: number;
  studentId: number;
  submittedAt: string;
  answers: Array<{
    questionId: number;
    selectedOptionId: number;
  }>;
  score?: number;
  status: 'submitted' | 'graded';
}

export interface QuizListResponse {
  quizzes: Quiz[];
}

export interface QuizDetailResponse {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export interface QuizSubmissionResponse {
  submission: QuizSubmission;
}
