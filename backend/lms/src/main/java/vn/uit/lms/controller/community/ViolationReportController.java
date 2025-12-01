package vn.uit.lms.controller.community;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.community.report.ViolationReportService;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.dto.request.community.report.*;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportDetailResponse;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportResponse;
import vn.uit.lms.shared.dto.PageResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ViolationReportController {

    private final ViolationReportService vrService;

    // -----------------------------
    // USER: CREATE REPORT
    // -----------------------------
    @PostMapping("/reports")
    public ResponseEntity<ViolationReportDetailResponse> create(
            @RequestBody ViolationReportCreateRequest req
    ) {
        return ResponseEntity.ok(vrService.create(req));
    }

    // -----------------------------
    // USER: LIST THEIR OWN REPORTS
    // -----------------------------
    @GetMapping("/reports")
    public ResponseEntity<PageResponse<ViolationReportResponse>> getMyReports(Pageable pageable) {
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
    @AdminOnly
    @GetMapping("/admin/reports")
    public ResponseEntity<PageResponse<ViolationReportResponse>> getAll(Pageable pageable) {
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
    @GetMapping("/reports/{id}")
    public ResponseEntity<ViolationReportDetailResponse> getDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(vrService.getById(id));
    }

//    // -----------------------------
//    // ADMIN: REVIEW
//    // -----------------------------
//    @AdminOnly
//    @PostMapping("/admin/reports/{id}/review")
//    public ResponseEntity<ViolationReportDetailResponse> review(
//            @PathVariable Long id,
//            @RequestBody ViolationReportReviewRequest req
//    ) {
//        return ResponseEntity.ok(vrService.review(id, req));
//    }

//    // -----------------------------
//    // ADMIN: DISMISS
//    // -----------------------------
//    @AdminOnly
//    @PostMapping("/admin/reports/{id}/dismiss")
//    public ResponseEntity<ViolationReportDetailResponse> dismiss(
//            @PathVariable Long id,
//            @RequestBody ViolationReportDismissRequest req
//    ) {
//        return ResponseEntity.ok(vrService.dismiss(id, req));
//    }

//    // -----------------------------
//    // ADMIN: TAKE ACTION
//    // -----------------------------
//    @AdminOnly
//    @PostMapping("/admin/reports/{id}/take-action")
//    public ResponseEntity<ViolationReportDetailResponse> takeAction(
//            @PathVariable Long id,
//            @RequestBody ViolationReportTakeActionRequest req
//    ) {
//        return ResponseEntity.ok(vrService.takeAction(id, req));
//    }
}
