package vn.uit.lms.controller.admin;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import vn.uit.lms.service.log.AuditLogService;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.io.IOException;
import java.time.Instant;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@RequiredArgsConstructor
@AdminOnly
public class AuditLogController {

    private final AuditLogService service;

    @GetMapping("/search")
    public ApiResponse<?> search(
            @RequestParam(defaultValue = "") String keyword,
            Pageable pageable
    ) {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Audit logs fetched successfully")
                .code("AUDIT_LOG_SEARCH")
                .data(service.search(keyword, pageable))
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }
    @GetMapping
    public ApiResponse<?> getAll(Pageable pageable) {
        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Audit logs fetched successfully")
                .code("AUDIT_LOG_LIST")
                .data(service.getAll(pageable))
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }
    @GetMapping("/export")
    public void export(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=audit_logs.csv");

        service.exportCsv(response.getWriter());
    }

}
