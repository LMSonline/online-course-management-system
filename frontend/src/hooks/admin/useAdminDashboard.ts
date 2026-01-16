import { useEffect, useState } from "react";
import { adminDashboardService } from "@/services/admin/dashboard.service";

import type {
  DashboardResponse,
  DashboardStatisticsResponse,
  RevenueReportResponse,
  UserReportResponse,
  CourseReportResponse,
} from "@/lib/admin/dashboard.types";


/* ================= MOCK DATA ================= */

const MOCK_DASHBOARD: DashboardResponse = {
  //  35 transactions × 1,000,000
  totalRevenue: 70_000_000,

  //  từ bảng accounts
  totalUsers: 43,

  // số course có giao dịch
  totalCourses: 7,

  // 5 students / 7 courses ≈ 0.7
  avgStudentsPerCourse: 0.7,

  // mock hợp lý vì chưa có progress thật
  avgCompletionRate: 68.4,

  teacherActivity: {
    totalTeachers: 10,        // id 34 → 43
    activeTeachers: 1,        // chưa approve teacher nào
    totalCoursesCreated: 43,  // tổng course trong DB
    totalLessonsCreated: 860, // khớp UI
  },

  // dựa vào course_review (rating 2–5)
  avgScore: 3.8,
};


const MOCK_STATISTICS: DashboardStatisticsResponse = {
  userGrowth: 8.5,
  courseGrowth: 5.2,
  revenueGrowth: 12.3,
  completionRate: 68.4,
};

const MOCK_REVENUE_REPORT: RevenueReportResponse = {
  totalRevenue: 70_000_000,
  chart: [
    { label: "Week 1", value: 6_000_000 },
    { label: "Week 2", value: 8_000_000 },
    { label: "Week 3", value: 10_000_000 },
    { label: "Week 4", value: 11_000_000 },
  ],
};


const MOCK_USER_REPORT: UserReportResponse = {
  totalUsers: 43,
  activeUsers: 43,   // tất cả ACTIVE
  inactiveUsers: 0,
};


const MOCK_COURSE_REPORT: CourseReportResponse = {
  totalCourses: 43,   // toàn DB
  activeCourses: 43,  // đều published
  closedCourses: 0,
};


interface UseAdminDashboardOptions {
  period: string;
  autoLoad?: boolean;
}

export function useAdminDashboard({
  period,
  autoLoad = true,
}: UseAdminDashboardOptions) {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);
  const [statistics, setStatistics] =
    useState<DashboardStatisticsResponse | null>(null);
  const [revenueReport, setRevenueReport] =
    useState<RevenueReportResponse | null>(null);
  const [userReport, setUserReport] =
    useState<UserReportResponse | null>(null);
  const [courseReport, setCourseReport] =
    useState<CourseReportResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const loadAll = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const [
  //       dashboardRes,
  //       statisticsRes,
  //       revenueRes,
  //       userRes,
  //       courseRes,
  //     ] = await Promise.all([
  //       adminDashboardService.getDashboard(period),
  //       adminDashboardService.getStatistics(period),
  //       adminDashboardService.getRevenueReport(period),
  //       adminDashboardService.getUserReport(period),
  //       adminDashboardService.getCourseReport(period),
  //     ]);

  //     setDashboard(dashboardRes);
  //     setStatistics(statisticsRes);
  //     setRevenueReport(revenueRes);
  //     setUserReport(userRes);
  //     setCourseReport(courseRes);
  //   } catch (e: any) {
  //     setError(e.message || "Failed to load dashboard");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const USE_MOCK = true;

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));

        setDashboard(MOCK_DASHBOARD);
        setStatistics(MOCK_STATISTICS);
        setRevenueReport(MOCK_REVENUE_REPORT);
        setUserReport(MOCK_USER_REPORT);
        setCourseReport(MOCK_COURSE_REPORT);

        return;
      }

      const [
        dashboardRes,
        statisticsRes,
        revenueRes,
        userRes,
        courseRes,
      ] = await Promise.all([
        adminDashboardService.getDashboard(period),
        adminDashboardService.getStatistics(period),
        adminDashboardService.getRevenueReport(period),
        adminDashboardService.getUserReport(period),
        adminDashboardService.getCourseReport(period),
      ]);

      setDashboard(dashboardRes);
      setStatistics(statisticsRes);
      setRevenueReport(revenueRes);
      setUserReport(userRes);
      setCourseReport(courseRes);
    } catch (e: any) {
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (autoLoad && period) {
      loadAll();
    }
  }, [period]);

  return {
    dashboard,
    statistics,
    revenueReport,
    userReport,
    courseReport,
    loading,
    error,
    reload: loadAll,
  };
}
