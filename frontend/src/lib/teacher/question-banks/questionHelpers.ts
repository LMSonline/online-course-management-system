import { QuestionType } from "@/services/assessment/assessment.types";

export const questionTypeConfig = {
  MULTIPLE_CHOICE: {
    label: "Multiple Choice",
    shortLabel: "MC",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "○",
    description: "Single correct answer from multiple options",
  },
  MULTI_SELECT: {
    label: "Multi Select",
    shortLabel: "MS",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: "☐",
    description: "Multiple correct answers possible",
  },
  TRUE_FALSE: {
    label: "True/False",
    shortLabel: "T/F",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "✓/✗",
    description: "Simple true or false question",
  },
  FILL_BLANK: {
    label: "Fill in Blank",
    shortLabel: "FB",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "—",
    description: "Fill in the blank text response",
  },
  ESSAY: {
    label: "Essay",
    shortLabel: "ES",
    color: "bg-pink-100 text-pink-700 border-pink-200",
    icon: "≡",
    description: "Extended written response",
  },
};

export const getTypeConfig = (type: QuestionType) => {
  return (
    questionTypeConfig[type] || {
      label: type,
      shortLabel: type.substring(0, 2),
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: "?",
      description: "Unknown question type",
    }
  );
};

export const formatQuestionContent = (
  content: string,
  maxLength: number = 100
): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

export const validateQuestion = (
  content: string,
  type: QuestionType,
  answerOptions?: Array<{ content: string; isCorrect: boolean }>
): { valid: boolean; error?: string } => {
  if (!content.trim()) {
    return { valid: false, error: "Question content is required" };
  }

  if (
    type === "MULTIPLE_CHOICE" ||
    type === "MULTI_SELECT" ||
    type === "TRUE_FALSE"
  ) {
    if (!answerOptions || answerOptions.length === 0) {
      return { valid: false, error: "Answer options are required" };
    }

    const hasCorrect = answerOptions.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      return {
        valid: false,
        error: "At least one answer must be marked as correct",
      };
    }

    const hasEmptyContent = answerOptions.some((opt) => !opt.content.trim());
    if (hasEmptyContent) {
      return { valid: false, error: "All answer options must have content" };
    }

    if (type === "MULTIPLE_CHOICE") {
      const correctCount = answerOptions.filter((opt) => opt.isCorrect).length;
      if (correctCount > 1) {
        return {
          valid: false,
          error: "Multiple choice questions can only have one correct answer",
        };
      }
    }

    if (type === "TRUE_FALSE" && answerOptions.length !== 2) {
      return {
        valid: false,
        error: "True/False questions must have exactly 2 options",
      };
    }
  }

  return { valid: true };
};

export const parseMetadata = (
  metadata?: string
): Record<string, any> | null => {
  if (!metadata) return null;
  try {
    return JSON.parse(metadata);
  } catch {
    return null;
  }
};

export const stringifyMetadata = (data: Record<string, any>): string => {
  try {
    return JSON.stringify(data);
  } catch {
    return "";
  }
};

export const getDifficultyColor = (difficulty?: string): string => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "hard":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const calculateBankStats = (questions: any[]) => {
  const stats = {
    total: questions.length,
    byType: {} as Record<QuestionType, number>,
    totalPoints: 0,
    avgPoints: 0,
  };

  questions.forEach((q) => {
    const questionType = q.type as QuestionType;
    stats.byType[questionType] = (stats.byType[questionType] || 0) + 1;
    stats.totalPoints += q.maxPoints || 0;
  });

  stats.avgPoints = stats.total > 0 ? stats.totalPoints / stats.total : 0;

  return stats;
};
