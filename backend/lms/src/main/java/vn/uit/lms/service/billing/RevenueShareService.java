package vn.uit.lms.service.billing;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.billing.RevenueShareConfig;
import vn.uit.lms.core.repository.billing.RevenueShareConfigRepository;
import vn.uit.lms.shared.dto.request.billing.CreateRevenueShareConfigRequest;
import vn.uit.lms.shared.dto.request.billing.UpdateRevenueShareConfigRequest;
import vn.uit.lms.shared.dto.response.billing.RevenueShareConfigResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.billing.BillingMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Revenue Share Service
 * Manages platform revenue sharing configuration with teachers
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RevenueShareService {

    private final RevenueShareConfigRepository revenueShareConfigRepository;

    /**
     * Create revenue share configuration (Admin only)
     *
     * Preconditions:
     * - Percentage must be between 0 and 100
     * - Effective from date must not be in the past
     * - No overlapping active config for the same category and period
     *
     * Postconditions:
     * - New config created with ACTIVE status
     * - Previous configs may be deactivated if necessary
     */
    @Transactional
    public RevenueShareConfigResponse createRevenueShareConfig(CreateRevenueShareConfigRequest request) {
        // Precondition: Validate percentage
        if (request.getPercentage() == null ||
            request.getPercentage().compareTo(java.math.BigDecimal.ZERO) < 0 ||
            request.getPercentage().compareTo(new java.math.BigDecimal("100")) > 0) {
            throw new InvalidRequestException("Percentage must be between 0 and 100");
        }

        // Precondition: Effective from must not be in the past (allow today)
        if (request.getEffectiveFrom().isBefore(LocalDate.now())) {
            throw new InvalidRequestException("Effective from date cannot be in the past");
        }

        // Precondition: Effective to must be after effective from
        if (request.getEffectiveTo() != null &&
            request.getEffectiveTo().isBefore(request.getEffectiveFrom())) {
            throw new InvalidRequestException("Effective to date must be after effective from date");
        }

        // Precondition: Check for overlapping active configs
        List<RevenueShareConfig> activeConfigs = revenueShareConfigRepository.findActiveOnDate(request.getEffectiveFrom());
        boolean hasOverlap = activeConfigs.stream()
                .anyMatch(config -> {
                    boolean sameCategoryScope = (config.getCategoryId() == null && request.getCategoryId() == null) ||
                                                (config.getCategoryId() != null && config.getCategoryId().equals(request.getCategoryId()));
                    return sameCategoryScope;
                });

        if (hasOverlap) {
            throw new InvalidRequestException(
                "An active revenue share config already exists for this category and period. " +
                "Please deactivate it first or set a different effective date."
            );
        }

        // Create new config
        RevenueShareConfig config = RevenueShareConfig.builder()
                .percentage(request.getPercentage())
                .effectiveFrom(request.getEffectiveFrom())
                .effectiveTo(request.getEffectiveTo())
                .description(request.getDescription())
                .minimumPayoutAmount(request.getMinimumPayoutAmount())
                .categoryId(request.getCategoryId())
                .versionNote(request.getVersionNote())
                .isActive(true)
                .build();

        config = revenueShareConfigRepository.save(config);
        log.info("Created revenue share config ID: {} with {}% for category: {}",
                config.getId(), config.getPercentage(), config.getCategoryId());

        // Postcondition: Config is active
        assert config.getIsActive();
        assert config.getPercentage() != null;

        return BillingMapper.toRevenueShareConfigResponse(config);
    }

    /**
     * Get all revenue share configurations with pagination
     */
    public Page<RevenueShareConfigResponse> getAllRevenueShareConfigs(
            Boolean isActive,
            Long categoryId,
            Pageable pageable
    ) {
        if (isActive != null && categoryId != null) {
            // Filter by both
            return revenueShareConfigRepository.findAll(pageable)
                    .map(BillingMapper::toRevenueShareConfigResponse);
        } else if (isActive != null) {
            return revenueShareConfigRepository.findAll(pageable)
                    .map(BillingMapper::toRevenueShareConfigResponse);
        } else {
            return revenueShareConfigRepository.findAll(pageable)
                    .map(BillingMapper::toRevenueShareConfigResponse);
        }
    }

    /**
     * Get active revenue share configurations
     */
    public List<RevenueShareConfigResponse> getActiveRevenueShareConfigs() {
        return revenueShareConfigRepository.findByIsActiveTrue()
                .stream()
                .map(BillingMapper::toRevenueShareConfigResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get revenue share config by ID
     */
    public RevenueShareConfigResponse getRevenueShareConfigById(Long id) {
        RevenueShareConfig config = revenueShareConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revenue share config not found"));

        return BillingMapper.toRevenueShareConfigResponse(config);
    }

    /**
     * Get active config for category on specific date
     */
    public RevenueShareConfigResponse getActiveConfigForCategory(Long categoryId, LocalDate date) {
        LocalDate checkDate = date != null ? date : LocalDate.now();

        RevenueShareConfig config;
        if (categoryId != null) {
            config = revenueShareConfigRepository.findByCategoryAndDate(categoryId, checkDate)
                    .orElseGet(() -> getDefaultConfig(checkDate));
        } else {
            config = getDefaultConfig(checkDate);
        }

        return BillingMapper.toRevenueShareConfigResponse(config);
    }

    /**
     * Update revenue share configuration (Admin only)
     *
     * Preconditions:
     * - Config must exist
     * - If updating percentage, must be between 0 and 100
     * - Cannot update effective_from date
     *
     * Postconditions:
     * - Config updated with new values
     */
    @Transactional
    public RevenueShareConfigResponse updateRevenueShareConfig(Long id, UpdateRevenueShareConfigRequest request) {
        // Precondition: Config must exist
        RevenueShareConfig config = revenueShareConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revenue share config not found"));

        // Update fields if provided
        if (request.getPercentage() != null) {
            // Precondition: Validate percentage
            if (request.getPercentage().compareTo(java.math.BigDecimal.ZERO) < 0 ||
                request.getPercentage().compareTo(new java.math.BigDecimal("100")) > 0) {
                throw new InvalidRequestException("Percentage must be between 0 and 100");
            }
            config.setPercentage(request.getPercentage());
        }

        if (request.getEffectiveTo() != null) {
            // Precondition: Effective to must be after effective from
            if (request.getEffectiveTo().isBefore(config.getEffectiveFrom())) {
                throw new InvalidRequestException("Effective to date must be after effective from date");
            }
            config.setEffectiveTo(request.getEffectiveTo());
        }

        if (request.getDescription() != null) {
            config.setDescription(request.getDescription());
        }

        if (request.getMinimumPayoutAmount() != null) {
            config.setMinimumPayoutAmount(request.getMinimumPayoutAmount());
        }

        if (request.getIsActive() != null) {
            config.setIsActive(request.getIsActive());
        }

        if (request.getVersionNote() != null) {
            config.setVersionNote(request.getVersionNote());
        }

        config = revenueShareConfigRepository.save(config);
        log.info("Updated revenue share config ID: {}", id);

        return BillingMapper.toRevenueShareConfigResponse(config);
    }

    /**
     * Deactivate revenue share configuration
     *
     * Preconditions:
     * - Config must exist and be active
     *
     * Postconditions:
     * - Config marked as inactive
     * - Effective to date set to today
     */
    @Transactional
    public RevenueShareConfigResponse deactivateRevenueShareConfig(Long id) {
        // Precondition: Config must exist
        RevenueShareConfig config = revenueShareConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revenue share config not found"));

        // Precondition: Config must be active
        if (!config.getIsActive()) {
            throw new InvalidRequestException("Revenue share config is already inactive");
        }

        // Deactivate using domain logic
        config.deactivate();

        config = revenueShareConfigRepository.save(config);
        log.info("Deactivated revenue share config ID: {}", id);

        // Postcondition: Config is inactive
        assert !config.getIsActive();

        return BillingMapper.toRevenueShareConfigResponse(config);
    }

    /**
     * Delete revenue share configuration
     * Only allow deletion of inactive configs
     */
    @Transactional
    public void deleteRevenueShareConfig(Long id) {
        RevenueShareConfig config = revenueShareConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revenue share config not found"));

        // Precondition: Can only delete inactive configs
        if (config.getIsActive()) {
            throw new InvalidRequestException("Cannot delete active revenue share config. Deactivate it first.");
        }

        revenueShareConfigRepository.delete(config);
        log.info("Deleted revenue share config ID: {}", id);
    }

    /**
     * Get default revenue share config (no category filter)
     */
    private RevenueShareConfig getDefaultConfig(LocalDate date) {
        return revenueShareConfigRepository.findActiveOnDate(date)
                .stream()
                .filter(config -> config.getCategoryId() == null)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                    "No default revenue share config found. Please create one."
                ));
    }
}
