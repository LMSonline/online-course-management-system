import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GlobalAnalytics,
  CourseRevenueBreakdown,
  CourseCompletionStats,
  StudentProgress,
  LessonEngagement,
  AssessmentStats,
  IntegrityAlert,
  CertificateStats,
  AnalyticsFilters,
} from "@/lib/teacher/analytics/types";

export interface CourseAnalytics {
  courseId: number;
  courseName: string;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageTimeSpent: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
}

// Mock data generators
const generateGlobalAnalytics = (timeRange: string): GlobalAnalytics => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const monthsToShow =
    timeRange === "30"
      ? 1
      : timeRange === "90"
        ? 3
        : timeRange === "180"
          ? 6
          : 12;

  const revenueTrend = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const month = date.toLocaleDateString("vi-VN", {
      month: "short",
      year: "numeric",
    });
    revenueTrend.push({
      month,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      enrollments: Math.floor(Math.random() * 200) + 100,
    });
  }

  const courses = [
    "Advanced React & Next.js Development",
    "Python for Data Science & Machine Learning",
    "Full-Stack Web Development Bootcamp",
    "UI/UX Design Masterclass",
    "Node.js & Express Backend Development",
  ];

  const topPerformingCourses = courses
    .map((name, index) => ({
      courseId: index + 1,
      courseName: name,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      enrollments: Math.floor(Math.random() * 500) + 200,
      rating: 4.5 + Math.random() * 0.5,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const totalRevenue = revenueTrend.reduce((sum, t) => sum + t.revenue, 0);
  const previousRevenue = totalRevenue * 0.85;
  const revenueGrowth =
    ((totalRevenue - previousRevenue) / previousRevenue) * 100;

  return {
    totalRevenue,
    revenueGrowth,
    totalEnrollments: revenueTrend.reduce((sum, t) => sum + t.enrollments, 0),
    enrollmentGrowth: 15.5,
    activeStudents: Math.floor(Math.random() * 2000) + 1500,
    avgCourseRating: 4.7,
    ratingChange: 0.3,
    revenueTrend,
    topPerformingCourses,
  };
};

const generateRevenueBreakdown = (): CourseRevenueBreakdown[] => {
  const courses = [
    "Advanced React & Next.js Development",
    "Python for Data Science",
    "Full-Stack Web Development",
    "UI/UX Design Masterclass",
    "Node.js Backend Development",
    "Mobile App Development",
    "DevOps & Cloud Computing",
  ];

  const breakdown = courses.map((name, index) => {
    const price = Math.floor(Math.random() * 2000000) + 500000;
    const unitsSold = Math.floor(Math.random() * 500) + 100;
    const totalRevenue = price * unitsSold;
    const platformFee = totalRevenue * 0.3;
    const netEarnings = totalRevenue - platformFee;

    return {
      courseId: index + 1,
      courseName: name,
      price,
      unitsSold,
      totalRevenue,
      platformFee,
      netEarnings,
      percentage: 0,
    };
  });

  const total = breakdown.reduce((sum, item) => sum + item.totalRevenue, 0);
  breakdown.forEach((item) => {
    item.percentage = (item.totalRevenue / total) * 100;
  });

  return breakdown.sort((a, b) => b.totalRevenue - a.totalRevenue);
};

const generateCourseCompletionStats = (
  courseId: number
): CourseCompletionStats => {
  const registered = Math.floor(Math.random() * 500) + 200;
  const halfwayComplete = Math.floor(registered * (0.6 + Math.random() * 0.2));
  const eligibleForExam = Math.floor(
    halfwayComplete * (0.7 + Math.random() * 0.2)
  );
  const certified = Math.floor(eligibleForExam * (0.8 + Math.random() * 0.15));

  return {
    courseId,
    courseName: "Advanced React & Next.js Development",
    totalEnrollments: registered,
    registered,
    halfwayComplete,
    eligibleForExam,
    certified,
    dropOffRate: ((registered - certified) / registered) * 100,
    averageProgress: (certified / registered) * 100,
  };
};

const generateStudentProgress = (count: number = 50): StudentProgress[] => {
  const statuses: StudentProgress["status"][] = [
    "ACTIVE",
    "ACTIVE",
    "ACTIVE",
    "COMPLETED",
    "EXPIRED",
  ];
  const names = [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Hoàng Cường",
    "Phạm Thu Dung",
    "Hoàng Minh Đức",
    "Võ Thị Hoa",
    "Đặng Quốc Huy",
    "Bùi Thanh Lan",
    "Lý Minh Quang",
    "Ngô Thu Hà",
    "Trương Văn Nam",
    "Phan Thị Linh",
  ];

  return Array.from({ length: count }, (_, i) => {
    const enrollmentDate = new Date(
      Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
    );
    const expiryDate = new Date(
      enrollmentDate.getTime() + 365 * 24 * 60 * 60 * 1000
    );
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const progress =
      status === "COMPLETED" ? 100 : Math.floor(Math.random() * 90) + 10;

    return {
      studentId: i + 1,
      studentName: names[Math.floor(Math.random() * names.length)],
      studentAvatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      progressPercentage: progress,
      enrollmentDate: enrollmentDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status,
      lastAccessDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  });
};

const generateLessonEngagement = (): LessonEngagement[] => {
  const lessons = [
    "Introduction to React Hooks",
    "State Management with Redux",
    "Server-Side Rendering with Next.js",
    "API Routes and Backend Integration",
    "Authentication & Authorization",
    "Database Design and Integration",
    "Deployment and DevOps",
    "Performance Optimization",
  ];

  return lessons.map((title, index) => {
    const completionRate = 70 + Math.random() * 25;
    const dropOffRate = 100 - completionRate;

    return {
      lessonId: index + 1,
      lessonTitle: title,
      viewCount: Math.floor(Math.random() * 800) + 200,
      avgWatchTime: Math.floor(Math.random() * 40) + 10,
      completionRate,
      dropOffRate,
      dropOffPoint: index === 4 ? 45 : undefined,
    };
  });
};

const generateAssessmentStats = (): AssessmentStats[] => {
  const assessments = [
    { name: "Quiz 1: React Basics", type: "QUIZ" as const },
    { name: "Quiz 2: Hooks & State", type: "QUIZ" as const },
    { name: "Assignment: Build a Todo App", type: "ASSIGNMENT" as const },
    { name: "Final Exam", type: "FINAL_EXAM" as const },
  ];

  return assessments.map((assessment, index) => {
    const avgScore = 5 + Math.random() * 4;
    const passRate = 60 + Math.random() * 30;

    return {
      assessmentId: index + 1,
      assessmentName: assessment.name,
      type: assessment.type,
      averageScore: avgScore,
      passRate,
      totalAttempts: Math.floor(Math.random() * 300) + 100,
      scoreDistribution: [
        {
          range: "0-4",
          count: Math.floor(Math.random() * 30) + 10,
          percentage: 0,
        },
        {
          range: "4-6",
          count: Math.floor(Math.random() * 50) + 30,
          percentage: 0,
        },
        {
          range: "6-8",
          count: Math.floor(Math.random() * 80) + 50,
          percentage: 0,
        },
        {
          range: "8-10",
          count: Math.floor(Math.random() * 60) + 40,
          percentage: 0,
        },
      ].map((item) => {
        const total = 180;
        return { ...item, percentage: (item.count / total) * 100 };
      }),
    };
  });
};

const generateIntegrityAlerts = (): IntegrityAlert[] => {
  const names = [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Hoàng Cường",
    "Phạm Thu Dung",
    "Hoàng Minh Đức",
  ];

  const courses = [
    "Advanced React Development",
    "Python Data Science",
    "Full-Stack Web Development",
  ];

  const assessments = ["Quiz 1", "Quiz 2", "Final Exam"];
  const types: IntegrityAlert["alertType"][] = [
    "TAB_SWITCHING",
    "MULTIPLE_IP",
    "SUSPICIOUS_SPEED",
    "COPY_PASTE",
  ];
  const flagTypes = [
    "Multiple Tab Switches",
    "IP Address Change",
    "Suspicious Completion Speed",
    "Copy-Paste Detected",
  ];
  const severities: IntegrityAlert["severity"][] = ["LOW", "MEDIUM", "HIGH"];
  const statuses: IntegrityAlert["status"][] = [
    "pending",
    "reviewed",
    "invalidated",
  ];

  return Array.from({ length: 15 }, (_, i) => {
    const typeIndex = Math.floor(Math.random() * types.length);
    const reviewed = Math.random() > 0.5;
    const detectedAt = new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    return {
      alertId: `alert-${i + 1}`,
      id: i + 1,
      studentId: i + 1,
      studentName: names[Math.floor(Math.random() * names.length)],
      studentAvatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      courseName: courses[Math.floor(Math.random() * courses.length)],
      assessmentName:
        assessments[Math.floor(Math.random() * assessments.length)],
      alertType: types[typeIndex],
      flagType: flagTypes[typeIndex],
      severity: severities[Math.floor(Math.random() * severities.length)],
      details: "Switched tabs 12 times during exam",
      description: "Student exhibited suspicious behavior during assessment",
      timestamp: detectedAt,
      detectedAt,
      reviewed,
      status: reviewed ? statuses[1] : statuses[0],
    };
  });
};

// Hooks - Using React Query for caching and better performance
export const useGlobalAnalytics = (filters: AnalyticsFilters) => {
  const { data, isLoading: loading } = useQuery({
    queryKey: ["global-analytics", filters.timeRange, filters.courseId],
    queryFn: () => generateGlobalAnalytics(filters.timeRange),
    staleTime: Infinity, // Mock data doesn't need refetching
  });

  return { data: data ?? null, loading };
};

export const useRevenueBreakdown = () => {
  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["revenue-breakdown"],
    queryFn: generateRevenueBreakdown,
    staleTime: Infinity,
  });

  const exportCSV = useCallback(() => {
    const csv =
      "Course,Price,Units Sold,Total Revenue,Platform Fee,Net Earnings\n" +
      data
        .map(
          (item) =>
            `"${item.courseName}",${item.price},${item.unitsSold},${item.totalRevenue},${item.platformFee},${item.netEarnings}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-breakdown-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return { data, loading, exportCSV };
};

// Helper to generate course analytics data
const generateCourseAnalyticsData = (): CourseAnalytics[] => {
  const courses = [
    "Advanced React & Next.js Development",
    "Python for Data Science & Machine Learning",
    "Full-Stack Web Development Bootcamp",
    "UI/UX Design Masterclass",
    "Node.js & Express Backend Development",
    "Mobile App Development with React Native",
    "DevOps & Cloud Computing AWS",
  ];

  return courses.map((name, index) => {
    const totalEnrollments = Math.floor(Math.random() * 500) + 200;
    const activeStudents = Math.floor(
      totalEnrollments * (0.6 + Math.random() * 0.3)
    );
    const studentsCompleted = Math.floor(
      totalEnrollments * (0.3 + Math.random() * 0.2)
    );
    const studentsInProgress = activeStudents - studentsCompleted;
    const studentsNotStarted =
      totalEnrollments - activeStudents - studentsCompleted;

    return {
      courseId: index + 1,
      courseName: name,
      totalEnrollments,
      activeStudents,
      completionRate: (studentsCompleted / totalEnrollments) * 100,
      averageTimeSpent: Math.floor(Math.random() * 30) + 15,
      studentsCompleted,
      studentsInProgress,
      studentsNotStarted,
    };
  });
};

export const useCourseAnalytics = () => {
  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["course-analytics"],
    queryFn: generateCourseAnalyticsData,
    staleTime: Infinity,
  });

  return { data, loading };
};

export const useCourseCompletion = (courseId: number | string) => {
  const [stats, setStats] = useState<CourseCompletionStats | null>(null);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [lessonEngagement, setLessonEngagement] = useState<LessonEngagement[]>(
    []
  );
  const [assessmentStats, setAssessmentStats] = useState<{
    averageScore: number;
    passRate: number;
    completionRate: number;
    difficultQuestions: Array<{ questionText: string; lessonName: string; correctRate: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const courseIdNum =
        typeof courseId === "string" ? parseInt(courseId, 10) : courseId;
      const completionStats = generateCourseCompletionStats(courseIdNum);
      const studentsList = generateStudentProgress(50);
      const lessons = generateLessonEngagement();

      // Generate assessment stats with difficult questions
      const avgScore = 65 + Math.random() * 20;
      const passRate = 70 + Math.random() * 20;
      const completionRate = 75 + Math.random() * 15;

      const difficultQuestions = [
        {
          questionText:
            "What is the correct way to implement useEffect with cleanup?",
          lessonName: "React Hooks Advanced",
          correctRate: 35 + Math.random() * 15,
        },
        {
          questionText: "How do you optimize React performance with memo?",
          lessonName: "Performance Optimization",
          correctRate: 40 + Math.random() * 15,
        },
        {
          questionText:
            "Explain the difference between useMemo and useCallback",
          lessonName: "React Hooks Advanced",
          correctRate: 45 + Math.random() * 10,
        },
      ];

      setStats(completionStats);
      setStudents(studentsList);
      setLessonEngagement(lessons);
      setAssessmentStats({
        averageScore: avgScore,
        passRate,
        completionRate,
        difficultQuestions,
      });
      setLoading(false);
    };

    if (courseId) fetchData();
  }, [courseId]);

  // Create data object with all info needed
  const data = stats
    ? {
      courseName: stats.courseName,
      funnel: {
        registered: stats.registered,
        halfComplete: stats.halfwayComplete,
        examEligible: stats.eligibleForExam,
        certified: stats.certified,
      },
      students,
      lessonEngagement,
      assessmentStats: assessmentStats || {
        averageScore: 0,
        passRate: 0,
        completionRate: 0,
        difficultQuestions: [],
      },
    }
    : null;

  return { data, loading };
};

export const useLessonEngagement = (courseId: number) => {
  const [data, setData] = useState<LessonEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(generateLessonEngagement());
      setLoading(false);
    };

    if (courseId) fetchData();
  }, [courseId]);

  return { data, loading };
};

export const useAssessmentAnalytics = (courseId: number) => {
  const [data, setData] = useState<AssessmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(generateAssessmentStats());
      setLoading(false);
    };

    if (courseId) fetchData();
  }, [courseId]);

  return { data, loading };
};

export const useIntegrityAlerts = (courseId?: number) => {
  const [data, setData] = useState<IntegrityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(generateIntegrityAlerts());
      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  const reviewAlert = async (alertId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setData((prev) =>
      prev.map((alert) =>
        alert.alertId === alertId
          ? { ...alert, reviewed: true, status: "reviewed" as const }
          : alert
      )
    );
  };

  const invalidateResult = async (alertId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setData((prev) =>
      prev.map((alert) =>
        alert.alertId === alertId
          ? { ...alert, status: "invalidated" as const }
          : alert
      )
    );
    return true;
  };

  return { data, loading, reviewAlert, invalidateResult };
};
