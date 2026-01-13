package vn.uit.lms.service.admin;

import vn.uit.lms.shared.dto.response.admin.CourseReportResponse;
import vn.uit.lms.shared.dto.response.admin.DashboardResponse;
import vn.uit.lms.shared.dto.response.admin.DashboardStatisticsResponse;
import vn.uit.lms.shared.dto.response.admin.RevenueReportResponse;
import vn.uit.lms.shared.dto.response.admin.UserReportResponse;

public interface DashboardService {

    DashboardResponse getDashboard(String period);

    DashboardStatisticsResponse getStatistics(String period);

    RevenueReportResponse getRevenueReport(String period);

    UserReportResponse getUserReport(String period);

    CourseReportResponse getCourseReport(String period);
}

