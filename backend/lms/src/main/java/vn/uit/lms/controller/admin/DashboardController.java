package vn.uit.lms.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.time.Instant;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@AdminOnly
public class DashboardController {

    @GetMapping("/dashboard")
    public ApiResponse<Object> dashboard() {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Dashboard summary loaded successfully")
                .code("DASHBOARD_SUMMARY")
                .data(
                        // You can replace with real dashboard data later
                        "Dashboard summary"
                )
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .license("MIT")
                        .version("1.0.0")
                        .build())
                .build();
    }

    @GetMapping("/statistics")
    public ApiResponse<Object> statistics() {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("System statistics retrieved")
                .code("SYSTEM_STATISTICS")
                .data("System statistics")
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @GetMapping("/reports/revenue")
    public ApiResponse<Object> revenueReport() {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Revenue report generated")
                .code("REVENUE_REPORT")
                .data("Revenue report")
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @GetMapping("/reports/users")
    public ApiResponse<Object> userReport() {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("User report generated")
                .code("USER_REPORT")
                .data("Users report")
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @GetMapping("/reports/courses")
    public ApiResponse<Object> courseReport() {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Course report generated")
                .code("COURSE_REPORT")
                .data("Courses report")
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }
}
