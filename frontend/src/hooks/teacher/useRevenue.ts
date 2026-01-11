import { useState, useEffect } from "react";
import {
  RevenueOverview,
  MonthlyRevenueStats,
  CourseRevenueBreakdown,
} from "@/lib/teacher/financial/types";

// Mock data generator
const generateMockRevenueData = (): RevenueOverview => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Generate monthly stats for last 12 months
  const monthlyStats: MonthlyRevenueStats[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const month = date.toISOString().slice(0, 7);
    monthlyStats.push({
      month,
      revenue: Math.floor(Math.random() * 15000000) + 5000000, // 5M - 20M VND
      enrollments: Math.floor(Math.random() * 50) + 10,
    });
  }

  // Generate course breakdown
  const courses = [
    "Advanced React & Next.js Development",
    "Python for Data Science",
    "UI/UX Design Masterclass",
    "Node.js Backend Development",
    "Mobile App Development with Flutter",
    "Machine Learning Fundamentals",
    "Digital Marketing Strategy",
  ];

  const courseBreakdown: CourseRevenueBreakdown[] = courses.map(
    (name, index) => ({
      courseId: index + 1,
      courseName: name,
      revenue: Math.floor(Math.random() * 50000000) + 10000000,
      enrollments: Math.floor(Math.random() * 100) + 20,
      percentage: 0, // Will be calculated below
    })
  );

  // Calculate percentages
  const totalCourseRevenue = courseBreakdown.reduce(
    (sum, c) => sum + c.revenue,
    0
  );
  courseBreakdown.forEach((course) => {
    course.percentage = (course.revenue / totalCourseRevenue) * 100;
  });

  // Sort by revenue descending
  courseBreakdown.sort((a, b) => b.revenue - a.revenue);

  const totalRevenue = monthlyStats.reduce(
    (sum, stat) => sum + stat.revenue,
    0
  );
  const totalPayouts = Math.floor(totalRevenue * 0.6); // 60% đã rút
  const pendingPayouts = Math.floor(Math.random() * 5000000); // Random pending
  const currentBalance = totalRevenue - totalPayouts - pendingPayouts;

  return {
    totalRevenue,
    currentBalance: Math.max(currentBalance, 0),
    totalPayouts,
    pendingPayouts,
    monthlyStats,
    courseBreakdown,
  };
};

export const useRevenue = () => {
  const [revenue, setRevenue] = useState<RevenueOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = generateMockRevenueData();
      setRevenue(data);
    } catch (err) {
      setError("Failed to fetch revenue data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return {
    revenue,
    loading,
    error,
    refetch: fetchRevenue,
  };
};

export const useMonthlyRevenue = (period?: string) => {
  const [data, setData] = useState<MonthlyRevenueStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate data based on period or default to current year
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      const monthlyStats: MonthlyRevenueStats[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.toISOString().slice(0, 7);
        monthlyStats.push({
          month,
          revenue: Math.floor(Math.random() * 15000000) + 5000000,
          enrollments: Math.floor(Math.random() * 50) + 10,
        });
      }

      setData(monthlyStats);
      setLoading(false);
    };

    fetchData();
  }, [period]);

  return { data, loading };
};

export const useRevenueBreakdown = () => {
  const [data, setData] = useState<CourseRevenueBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const courses = [
        "Advanced React & Next.js",
        "Python Data Science",
        "UI/UX Design",
        "Node.js Backend",
        "Flutter Mobile Dev",
        "Machine Learning",
        "Digital Marketing",
      ];

      const breakdown: CourseRevenueBreakdown[] = courses.map(
        (name, index) => ({
          courseId: index + 1,
          courseName: name,
          revenue: Math.floor(Math.random() * 50000000) + 10000000,
          enrollments: Math.floor(Math.random() * 100) + 20,
          percentage: 0,
        })
      );

      const total = breakdown.reduce((sum, c) => sum + c.revenue, 0);
      breakdown.forEach((course) => {
        course.percentage = (course.revenue / total) * 100;
      });

      breakdown.sort((a, b) => b.revenue - a.revenue);

      setData(breakdown);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
};
