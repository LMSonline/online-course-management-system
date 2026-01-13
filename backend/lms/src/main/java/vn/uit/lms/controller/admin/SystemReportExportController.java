package vn.uit.lms.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import vn.uit.lms.shared.dto.request.admin.ReportPeriodRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin/reports/system")
@AdminOnly
public class SystemReportExportController {

    /**
     * Export system report (CSV / Excel / PDF)
     */
    @GetMapping("/export")
    public void exportSystemReport(
            @Valid ReportPeriodRequest period,
            HttpServletResponse response
    ) throws IOException {

        // demo export CSV
        response.setContentType("text/csv");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=system-report.csv"
        );

        response.getWriter().println("metric,value");
        response.getWriter().println("totalUsers,1000");
        response.getWriter().println("totalCourses,120");
        response.getWriter().println("totalRevenue,50000000");

        response.getWriter().flush();
    }
}
