import { useState, useEffect, useCallback } from "react";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
  QuizResponse,
  QuizResultResponse,
  QuizStatisticsResponse,
  QuizAttemptResponse,
} from "@/services/assessment/assessment.types";

interface UseQuizResultsOptions {
  quizId: number;
  autoLoad?: boolean;
}

export function useQuizResults({
  quizId,
  autoLoad = true,
}: UseQuizResultsOptions) {
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [results, setResults] = useState<QuizResultResponse | null>(null);
  const [statistics, setStatistics] = useState<QuizStatisticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load quiz details
  const loadQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentService.getQuizById(quizId);
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || "Failed to load quiz");
      console.error("Failed to load quiz:", err);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  // Load results
  const loadResults = useCallback(async () => {
    try {
      const data = await assessmentService.getQuizResults(quizId);
      setResults(data);
    } catch (err: any) {
      console.error("Failed to load results:", err);
    }
  }, [quizId]);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const data = await assessmentService.getQuizStatistics(quizId);
      setStatistics(data);
    } catch (err: any) {
      console.error("Failed to load statistics:", err);
    }
  }, [quizId]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && quizId) {
      loadQuiz();
      loadResults();
      loadStatistics();
    }
  }, [autoLoad, quizId, loadQuiz, loadResults, loadStatistics]);

  // Export results to CSV
  const exportToCSV = useCallback(() => {
    if (!results) return;

    const headers = [
      "Student Name",
      "Student Code",
      "Attempts",
      "Best Score",
      "Last Attempt",
      "Passed",
    ];

    const rows = results.studentResults.map((student) => [
      student.studentName,
      student.studentCode || "-",
      student.attempts.toString(),
      student.bestScore !== undefined ? student.bestScore.toFixed(2) : "-",
      student.lastAttemptAt
        ? new Date(student.lastAttemptAt).toLocaleString()
        : "-",
      student.passed ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-results-${quizId}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [results, quizId]);

  return {
    quiz,
    results,
    statistics,
    loading,
    error,
    refresh: () => {
      loadQuiz();
      loadResults();
      loadStatistics();
    },
    exportToCSV,
  };
}
