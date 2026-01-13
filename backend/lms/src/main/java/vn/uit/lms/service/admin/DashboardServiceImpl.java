package vn.uit.lms.service.admin;


import org.springframework.stereotype.Service;
import vn.uit.lms.shared.dto.response.admin.*;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    /* ================= DASHBOARD CARDS ================= */

    @Override
    public DashboardResponse getDashboard(String period) {
        DashboardResponse res = new DashboardResponse();

        res.setTotalRevenue(3_500_000L);
        res.setTotalStudents(1200L);
        res.setTotalCourses(85L);
        res.setAvgCompletionRate(72.5);
        res.setAvgScore(8.1);
        res.setActiveTeachers(45L);

        return res;
    }

    /* ================= STATISTICS / CHARTS ================= */

    @Override
    public DashboardStatisticsResponse getStatistics(String period) {
        DashboardStatisticsResponse res = new DashboardStatisticsResponse();

        res.setRevenueTrend(List.of(
            new TimeSeriesItem("Week 1", 800_000D),
            new TimeSeriesItem("Week 2", 900_000D),
            new TimeSeriesItem("Week 3", 700_000D),
            new TimeSeriesItem("Week 4", 1_100_000D)
        ));

        res.setUserGrowth(List.of(
            new TimeSeriesItem("Week 1", 120D),
            new TimeSeriesItem("Week 2", 150D),
            new TimeSeriesItem("Week 3", 100D),
            new TimeSeriesItem("Week 4", 180D)
        ));

        res.setCourseCompletion(List.of(
            new TimeSeriesItem("Course A", 75D),
            new TimeSeriesItem("Course B", 68D),
            new TimeSeriesItem("Course C", 82D)
        ));

        return res;
    }

    /* ================= REPORTS ================= */

    @Override
    public RevenueReportResponse getRevenueReport(String period) {
        RevenueReportResponse res = new RevenueReportResponse();
        res.setTotalRevenue(3_500_000L);
        return res;
    }

    @Override
    public UserReportResponse getUserReport(String period) {
        UserReportResponse res = new UserReportResponse();
        res.setTotalUsers(1200L);
        res.setNewUsers(180L);
        res.setActiveUsers(950L);
        return res;
    }

    @Override
    public CourseReportResponse getCourseReport(String period) {
        CourseReportResponse res = new CourseReportResponse();
        res.setTotalCourses(85L);
        res.setAvgCompletionRate(72.5);
        res.setAvgScore(8.1);
        return res;
    }
}
