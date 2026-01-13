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
  totalRevenue: 125000000,
  totalUsers: 1280,
  totalCourses: 120,

  avgStudentsPerCourse: 32.5,
  avgCompletionRate: 68.4,

  teacherActivity: {
    totalTeachers: 45,
    activeTeachers: 32,
    totalCoursesCreated: 120,
    totalLessonsCreated: 860,
  },
  avgScore: 7.8
};

const MOCK_STATISTICS: DashboardStatisticsResponse = {
  userGrowth: 8.5,        // %
  courseGrowth: 5.2,      // %
  revenueGrowth: 12.3,    // %
  completionRate: 68.4,   // %
};

const MOCK_REVENUE_REPORT: RevenueReportResponse = {
  totalRevenue: 125_000_000,
  chart: [
    { label: "Week 1", value: 20_000_000 },
    { label: "Week 2", value: 28_000_000 },
    { label: "Week 3", value: 35_000_000 },
    { label: "Week 4", value: 42_000_000 },
  ],
};

const MOCK_USER_REPORT: UserReportResponse = {
  totalUsers: 1280,
  activeUsers: 860,
  inactiveUsers: 420,
};

const MOCK_COURSE_REPORT: CourseReportResponse = {
  totalCourses: 120,
  activeCourses: 95,
  closedCourses: 25,
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
