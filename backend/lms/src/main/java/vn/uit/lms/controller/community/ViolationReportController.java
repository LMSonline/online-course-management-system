package vn.uit.lms.controller.community;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.community.report.ViolationReportService;
import vn.uit.lms.shared.annotation.AdminOnly;
import vn.uit.lms.shared.annotation.Authenticated;
import vn.uit.lms.shared.dto.request.community.report.*;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportDetailResponse;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportResponse;
import vn.uit.lms.shared.dto.PageResponse;

/**
 * ViolationReportController - Thin controller for violation report management
 *
 * Responsibilities:
 * - Handle HTTP requests/responses
 * - Validate request format
 * - Delegate business logic to service layer
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Violation Report Management", description = "APIs for reporting and managing violations")
public class ViolationReportController {

    private final ViolationReportService vrService;

    // -----------------------------
    // USER: CREATE REPORT
    // -----------------------------
    @Operation(
            summary = "Create violation report",
            description = "Submit a report for violating content or behavior"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/reports")
    @Authenticated
    public ResponseEntity<ViolationReportDetailResponse> create(
            @Parameter(description = "Report details")
            @Valid @RequestBody ViolationReportCreateRequest req
    ) {
        ViolationReportDetailResponse response = vrService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // -----------------------------
    // USER: LIST THEIR OWN REPORTS
    // -----------------------------
    @Operation(
            summary = "Get my reports",
            description = "Get list of reports submitted by current user"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/reports")
    @Authenticated
    public ResponseEntity<PageResponse<ViolationReportResponse>> getMyReports(
            @Parameter(hidden = true) Pageable pageable) {
        var page = vrService.getMyReports(pageable);
        var pageResponse = PageResponse.<ViolationReportResponse>builder()
                .items(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();

        return ResponseEntity.ok(pageResponse);
    }

    // -----------------------------
    // ADMIN: LIST ALL REPORTS
    // -----------------------------
    @Operation(
            summary = "Get all reports (Admin)",
            description = "Get list of all violation reports"
    )
    @SecurityRequirement(name = "bearerAuth")
    @AdminOnly
    @GetMapping("/admin/reports")
    public ResponseEntity<PageResponse<ViolationReportResponse>> getAll(
            @Parameter(hidden = true) Pageable pageable) {
        var page = vrService.getAllReports(pageable);
        var pageResponse = PageResponse.<ViolationReportResponse>builder()
                .items(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();

        return ResponseEntity.ok(pageResponse);
    }

    // -----------------------------
    // DETAIL
    // -----------------------------
    @Operation(
            summary = "Get report details",
            description = "Get detailed information about a specific report"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/reports/{id}")
    @Authenticated
    public ResponseEntity<ViolationReportDetailResponse> getDetail(
            @Parameter(description = "Report ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok(vrService.getById(id));
    }

    // -----------------------------
    // ADMIN: REVIEW
    // -----------------------------
    @Operation(
            summary = "Review report (Admin)",
            description = "Move report to IN_REVIEW status and add reviewer notes"
    )
    @SecurityRequirement(name = "bearerAuth")
    @AdminOnly
    @PostMapping("/admin/reports/{id}/review")
    public ResponseEntity<ViolationReportDetailResponse> review(
            @Parameter(description = "Report ID") @PathVariable Long id,
            @Parameter(description = "Review details")
            @Valid @RequestBody ViolationReportReviewRequest req
    ) {
        return ResponseEntity.ok(vrService.review(id, req));
    }

    // -----------------------------
    // ADMIN: DISMISS
    // -----------------------------
    @Operation(
            summary = "Dismiss report (Admin)",
            description = "Dismiss report as invalid or not violating"
    )
    @SecurityRequirement(name = "bearerAuth")
    @AdminOnly
    @PostMapping("/admin/reports/{id}/dismiss")
    public ResponseEntity<ViolationReportDetailResponse> dismiss(
            @Parameter(description = "Report ID") @PathVariable Long id,
            @Parameter(description = "Dismissal reason")
            @Valid @RequestBody ViolationReportDismissRequest req
    ) {
        return ResponseEntity.ok(vrService.dismiss(id, req));
    }

    // -----------------------------
    // ADMIN: TAKE ACTION
    // -----------------------------
    @Operation(
            summary = "Take action on report (Admin)",
            description = "Execute enforcement action (ban user, delete comment, hide course, etc.)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @AdminOnly
    @PostMapping("/admin/reports/{id}/take-action")
    public ResponseEntity<ViolationReportDetailResponse> takeAction(
            @Parameter(description = "Report ID") @PathVariable Long id,
            @Parameter(description = "Action details")
            @Valid @RequestBody ViolationReportTakeActionRequest req
    ) {
        return ResponseEntity.ok(vrService.takeAction(id, req));
    }
}
