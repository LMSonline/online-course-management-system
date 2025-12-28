package vn.uit.lms.service.billing;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.billing.PaymentTransaction;
import vn.uit.lms.core.domain.billing.Payout;
import vn.uit.lms.core.domain.billing.RevenueShareConfig;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.billing.PaymentTransactionRepository;
import vn.uit.lms.core.repository.billing.PayoutRepository;
import vn.uit.lms.core.repository.billing.RevenueShareConfigRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.PaymentStatus;
import vn.uit.lms.shared.constant.PayoutStatus;
import vn.uit.lms.shared.dto.request.billing.CompletePayoutRequest;
import vn.uit.lms.shared.dto.request.billing.CreatePayoutRequest;
import vn.uit.lms.shared.dto.request.billing.RejectPayoutRequest;
import vn.uit.lms.shared.dto.response.billing.PayoutResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.billing.BillingMapper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Payout Service
 * Handles teacher payment requests with strict financial controls
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PayoutService {

    private final PayoutRepository payoutRepository;
    private final PaymentTransactionRepository paymentRepository;
    private final RevenueShareConfigRepository revenueShareConfigRepository;
    private final TeacherRepository teacherRepository;
    private final AccountService accountService;

    private static final BigDecimal MINIMUM_PAYOUT_AMOUNT = new BigDecimal("100000"); // 100,000 VND
    private static final BigDecimal TRANSFER_FEE_PERCENTAGE = new BigDecimal("0.01"); // 1% transfer fee
    private static final BigDecimal TAX_PERCENTAGE = new BigDecimal("0.10"); // 10% tax

    /**
     * Create payout request
     *
     * Preconditions:
     * - Teacher must be authenticated
     * - Must have sufficient earnings for the period
     * - No pending payout for the same period
     * - Amount must exceed minimum threshold
     * - Bank account details must be provided
     *
     * Postconditions:
     * - Payout request created with PENDING status
     * - Admin notified for approval
     */
    @Transactional
    public PayoutResponse createPayoutRequest(CreatePayoutRequest request) {
        // Precondition: Verify teacher
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        // Precondition: Validate period format (YYYY-MM)
        YearMonth payoutPeriod;
        try {
            payoutPeriod = YearMonth.parse(request.getPayoutPeriod());
        } catch (Exception e) {
            throw new InvalidRequestException("Invalid payout period format. Use YYYY-MM");
        }

        // Precondition: Period must be in the past
        if (payoutPeriod.isAfter(YearMonth.now()) || payoutPeriod.equals(YearMonth.now())) {
            throw new InvalidRequestException("Can only request payout for completed months");
        }

        // Precondition: No pending payout for this period
        boolean hasPendingPayout = payoutRepository.existsByTeacherIdAndPayoutPeriodAndStatus(
                teacher.getId(),
                request.getPayoutPeriod(),
                PayoutStatus.PENDING
        );
        if (hasPendingPayout) {
            throw new InvalidRequestException("You already have a pending payout request for this period");
        }

        // Calculate earnings for the period
        LocalDate startDate = payoutPeriod.atDay(1);
        LocalDate endDate = payoutPeriod.atEndOfMonth();

        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

        List<PaymentTransaction> payments = paymentRepository.findByTeacherIdAndDateRange(
                teacher.getId(),
                startInstant,
                endInstant
        );

        payments = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .collect(Collectors.toList());

        if (payments.isEmpty()) {
            throw new InvalidRequestException("No revenue found for this period");
        }

        // Get revenue share config
        RevenueShareConfig revenueConfig = getDefaultRevenueConfig();
        Float revenueSharePercentage = revenueConfig.getPercentage().floatValue();

        BigDecimal totalRevenue = payments.stream()
                .map(PaymentTransaction::getNetAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal teacherEarnings = payments.stream()
                .map(p -> p.getTeacherRevenue(revenueSharePercentage))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Precondition: Check minimum payout amount
        if (teacherEarnings.compareTo(MINIMUM_PAYOUT_AMOUNT) < 0) {
            throw new InvalidRequestException(
                    String.format("Minimum payout amount is %s VND. Your earnings for this period: %s VND",
                            MINIMUM_PAYOUT_AMOUNT, teacherEarnings)
            );
        }

        int totalEnrollments = (int) payments.stream()
                .map(p -> p.getStudent().getId())
                .distinct()
                .count();

        // Calculate transfer fee and tax
        BigDecimal transferFee = teacherEarnings.multiply(TRANSFER_FEE_PERCENTAGE);
        BigDecimal taxAmount = teacherEarnings.multiply(TAX_PERCENTAGE);
        BigDecimal netAmount = teacherEarnings.subtract(transferFee).subtract(taxAmount);

        // Create payout request
        Payout payout = Payout.builder()
                .teacher(teacher)
                .amount(teacherEarnings)
                .currency("VND")
                .status(PayoutStatus.PENDING)
                .payoutPeriod(request.getPayoutPeriod())
                .reference("PAYOUT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .revenueSharePercentage(revenueSharePercentage)
                .totalRevenue(totalRevenue)
                .totalEnrollments(totalEnrollments)
                .bankAccountNumber(request.getBankAccountNumber())
                .bankName(request.getBankName())
                .accountHolderName(request.getAccountHolderName())
                .notes(request.getNotes())
                .transferFee(transferFee)
                .taxAmount(taxAmount)
                .netAmount(netAmount)
                .build();

        payout = payoutRepository.save(payout);
        log.info("Created payout request ID: {} for teacher: {} period: {} amount: {}",
                payout.getId(), teacher.getId(), request.getPayoutPeriod(), teacherEarnings);

        // Postcondition: Payout created with PENDING status
        assert payout.getStatus() == PayoutStatus.PENDING;
        assert payout.getAmount().compareTo(BigDecimal.ZERO) > 0;

        // TODO: Send notification to admin for approval

        return BillingMapper.toPayoutResponse(payout);
    }

    /**
     * Get payout by ID
     */
    public PayoutResponse getPayoutById(Long id) {
        Payout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found"));

        return BillingMapper.toPayoutResponse(payout);
    }

    /**
     * Get all payouts with filters
     */
    public Page<PayoutResponse> getAllPayouts(
            PayoutStatus status,
            Long teacherId,
            String period,
            Pageable pageable
    ) {
        Specification<Payout> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (teacherId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("teacher").get("id"), teacherId));
        }
        if (period != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("payoutPeriod"), period));
        }

        return payoutRepository.findAll(spec, pageable)
                .map(BillingMapper::toPayoutResponse);
    }

    /**
     * Get my payouts (current teacher)
     */
    public List<PayoutResponse> getMyPayouts() {
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return payoutRepository.findByTeacherIdOrderByCreatedAtDesc(teacher.getId())
                .stream()
                .map(BillingMapper::toPayoutResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get teacher's payouts
     */
    public List<PayoutResponse> getTeacherPayouts(Long teacherId) {
        if (!teacherRepository.existsById(teacherId)) {
            throw new ResourceNotFoundException("Teacher not found");
        }

        return payoutRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId)
                .stream()
                .map(BillingMapper::toPayoutResponse)
                .collect(Collectors.toList());
    }

    /**
     * Complete payout (Admin only)
     *
     * Preconditions:
     * - Payout must exist and be PENDING
     * - Bank transaction ID must be provided
     * - User must be admin
     *
     * Postconditions:
     * - Payout status changed to COMPLETED
     * - Payout date recorded
     * - Teacher notified
     */
    @Transactional
    public PayoutResponse completePayout(Long payoutId, CompletePayoutRequest request) {
        // Note: Authorization check should be done at controller level with @AdminOnly
        Account account = accountService.verifyCurrentAccount();

        // Precondition: Payout must exist
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found"));

        // Precondition: Payout must be PENDING
        if (!payout.isPending()) {
            throw new InvalidRequestException("Payout is not in PENDING status");
        }

        // Complete payout using rich domain logic
        payout.complete(request.getBankTransactionId(), account.getUsername());

        if (request.getNotes() != null) {
            payout.setNotes(payout.getNotes() + "\n[Admin] " + request.getNotes());
        }

        payout = payoutRepository.save(payout);
        log.info("Payout {} completed by {} with bank transaction: {}",
                payoutId, account.getUsername(), request.getBankTransactionId());

        // Postcondition: Payout is COMPLETED
        assert payout.getStatus() == PayoutStatus.COMPLETED;
        assert payout.getPayoutDate() != null;
        assert payout.getBankTransactionId() != null;

        // TODO: Send notification to teacher

        return BillingMapper.toPayoutResponse(payout);
    }

    /**
     * Reject payout (Admin only)
     *
     * Preconditions:
     * - Payout must exist and be PENDING
     * - Rejection reason must be provided
     * - User must be admin
     *
     * Postconditions:
     * - Payout status changed to FAILED
     * - Rejection reason recorded
     * - Teacher notified
     */
    @Transactional
    public PayoutResponse rejectPayout(Long payoutId, RejectPayoutRequest request) {
        // Note: Authorization check should be done at controller level with @AdminOnly

        // Precondition: Payout must exist
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found"));

        // Precondition: Payout must be PENDING
        if (!payout.isPending()) {
            throw new InvalidRequestException("Payout is not in PENDING status");
        }

        // Reject payout using rich domain logic
        payout.reject(request.getReason());

        payout = payoutRepository.save(payout);
        log.info("Payout {} rejected: {}", payoutId, request.getReason());

        // Postcondition: Payout is FAILED
        assert payout.getStatus() == PayoutStatus.FAILED;
        assert payout.getFailureReason() != null;

        // TODO: Send notification to teacher with rejection reason

        return BillingMapper.toPayoutResponse(payout);
    }

    /**
     * Get pending payouts count for admin dashboard
     */
    public long getPendingPayoutsCount() {
        return payoutRepository.findByStatus(PayoutStatus.PENDING).size();
    }

    /**
     * Get available payout amount for teacher in current month
     */
    public BigDecimal getAvailablePayoutAmount(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        LocalDate startDate = lastMonth.atDay(1);
        LocalDate endDate = lastMonth.atEndOfMonth();

        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

        List<PaymentTransaction> payments = paymentRepository.findByTeacherIdAndDateRange(
                teacher.getId(),
                startInstant,
                endInstant
        );

        payments = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .collect(Collectors.toList());

        if (payments.isEmpty()) {
            return BigDecimal.ZERO;
        }

        RevenueShareConfig revenueConfig = getDefaultRevenueConfig();
        Float revenueSharePercentage = revenueConfig.getPercentage().floatValue();

        BigDecimal teacherEarnings = payments.stream()
                .map(p -> p.getTeacherRevenue(revenueSharePercentage))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Check if already requested payout for this period
        boolean alreadyRequested = payoutRepository
                .findByTeacherIdAndPayoutPeriod(teacher.getId(), lastMonth.toString())
                .isPresent();

        return alreadyRequested ? BigDecimal.ZERO : teacherEarnings;
    }

    /**
     * Get my available payout amount (current teacher)
     */
    public BigDecimal getMyAvailablePayoutAmount() {
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return getAvailablePayoutAmount(teacher.getId());
    }

    /**
     * Get default revenue share config
     */
    private RevenueShareConfig getDefaultRevenueConfig() {
        return revenueShareConfigRepository.findActiveOnDate(LocalDate.now())
                .stream()
                .filter(config -> config.getCategoryId() == null)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active revenue share config found"));
    }
}


