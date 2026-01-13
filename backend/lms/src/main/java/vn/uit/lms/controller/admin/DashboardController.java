package vn.uit.lms.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import vn.uit.lms.service.admin.DashboardService;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.response.admin.*;
import vn.uit.lms.shared.util.annotation.AdminOnly;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@AdminOnly
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Dashboard tổng quan hệ thống
     */
    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> getDashboard(
            @RequestParam String period
    ) {
        return ApiResponse.success(
                dashboardService.getDashboard(period)
        );
    }

    /**
     * Thống kê toàn hệ thống
     */
    @GetMapping("/statistics")
    public ApiResponse<DashboardStatisticsResponse> getStatistics(
            @RequestParam String period
    ) {
        return ApiResponse.success(
                dashboardService.getStatistics(period)
        );
    }

    /**
     * Báo cáo doanh thu
     */
    @GetMapping("/reports/revenue")
    public ApiResponse<RevenueReportResponse> getRevenueReport(
            @RequestParam String period
    ) {
        return ApiResponse.success(
                dashboardService.getRevenueReport(period)
        );
    }

    /**
     * Báo cáo người dùng
     */
    @GetMapping("/reports/users")
    public ApiResponse<UserReportResponse> getUserReport(
            @RequestParam String period
    ) {
        return ApiResponse.success(
                dashboardService.getUserReport(period)
        );
    }

    /**
     * Báo cáo khóa học
     */
    @GetMapping("/reports/courses")
    public ApiResponse<CourseReportResponse> getCourseReport(
            @RequestParam String period
    ) {
        return ApiResponse.success(
                dashboardService.getCourseReport(period)
        );
    }
}
