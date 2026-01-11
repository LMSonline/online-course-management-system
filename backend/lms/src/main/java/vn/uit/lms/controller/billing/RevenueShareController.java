package vn.uit.lms.controller.billing;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.billing.RevenueShareService;
import vn.uit.lms.shared.dto.request.billing.CreateRevenueShareConfigRequest;
import vn.uit.lms.shared.dto.request.billing.UpdateRevenueShareConfigRequest;
import vn.uit.lms.shared.dto.response.billing.RevenueShareConfigResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.time.LocalDate;
import java.util.List;

/**
 * Revenue Share Controller
 * Admin manages platform revenue sharing configuration with teachers
 */
@RestController
@RequestMapping("/api/v1/admin/revenue-share")
@RequiredArgsConstructor
public class RevenueShareController {

    private final RevenueShareService revenueShareService;

    /**
     * Create revenue share configuration (Admin only)
     * POST /admin/revenue-share
     */
    @PostMapping
    @AdminOnly
    public ResponseEntity<RevenueShareConfigResponse> createRevenueShareConfig(
            @RequestBody @Valid CreateRevenueShareConfigRequest request
    ) {
        return ResponseEntity.ok(revenueShareService.createRevenueShareConfig(request));
    }

    /**
     * Get all revenue share configurations with pagination and filters
     * GET /admin/revenue-share
     */
    @GetMapping
    @AdminOnly
    public ResponseEntity<Page<RevenueShareConfigResponse>> getAllRevenueShareConfigs(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Long categoryId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(revenueShareService.getAllRevenueShareConfigs(isActive, categoryId, pageable));
    }

    /**
     * Get active revenue share configurations
     * GET /admin/revenue-share/active
     */
    @GetMapping("/active")
    @AdminOnly
    public ResponseEntity<List<RevenueShareConfigResponse>> getActiveRevenueShareConfigs() {
        return ResponseEntity.ok(revenueShareService.getActiveRevenueShareConfigs());
    }

    /**
     * Get revenue share config by ID
     * GET /admin/revenue-share/{id}
     */
    @GetMapping("/{id}")
    @AdminOnly
    public ResponseEntity<RevenueShareConfigResponse> getRevenueShareConfigById(@PathVariable Long id) {
        return ResponseEntity.ok(revenueShareService.getRevenueShareConfigById(id));
    }

    /**
     * Get active config for category on specific date
     * GET /admin/revenue-share/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    @AdminOnly
    public ResponseEntity<RevenueShareConfigResponse> getActiveConfigForCategory(
            @PathVariable Long categoryId,
            @RequestParam(required = false) LocalDate date
    ) {
        return ResponseEntity.ok(revenueShareService.getActiveConfigForCategory(categoryId, date));
    }

    /**
     * Get default (global) active config
     * GET /admin/revenue-share/default
     */
    @GetMapping("/default")
    @AdminOnly
    public ResponseEntity<RevenueShareConfigResponse> getDefaultConfig(
            @RequestParam(required = false) LocalDate date
    ) {
        return ResponseEntity.ok(revenueShareService.getActiveConfigForCategory(null, date));
    }

    /**
     * Update revenue share configuration (Admin only)
     * PUT /admin/revenue-share/{id}
     */
    @PutMapping("/{id}")
    @AdminOnly
    public ResponseEntity<RevenueShareConfigResponse> updateRevenueShareConfig(
            @PathVariable Long id,
            @RequestBody @Valid UpdateRevenueShareConfigRequest request
    ) {
        return ResponseEntity.ok(revenueShareService.updateRevenueShareConfig(id, request));
    }

    /**
     * Deactivate revenue share configuration
     * POST /admin/revenue-share/{id}/deactivate
     */
    @PostMapping("/{id}/deactivate")
    @AdminOnly
    public ResponseEntity<RevenueShareConfigResponse> deactivateRevenueShareConfig(@PathVariable Long id) {
        return ResponseEntity.ok(revenueShareService.deactivateRevenueShareConfig(id));
    }

    /**
     * Delete revenue share configuration (only inactive configs)
     * DELETE /admin/revenue-share/{id}
     */
    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteRevenueShareConfig(@PathVariable Long id) {
        revenueShareService.deleteRevenueShareConfig(id);
        return ResponseEntity.noContent().build();
    }
}
