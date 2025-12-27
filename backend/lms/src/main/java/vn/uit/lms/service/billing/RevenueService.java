package vn.uit.lms.service.billing;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
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
import vn.uit.lms.shared.dto.response.billing.MonthlyRevenueResponse;
import vn.uit.lms.shared.dto.response.billing.PaymentTransactionResponse;
import vn.uit.lms.shared.dto.response.billing.RevenueBreakdownResponse;
import vn.uit.lms.shared.dto.response.billing.TeacherRevenueResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.billing.BillingMapper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RevenueService {

    private final PaymentTransactionRepository paymentRepository;
    private final PayoutRepository payoutRepository;
    private final RevenueShareConfigRepository revenueShareConfigRepository;
    private final TeacherRepository teacherRepository;
    private final AccountService accountService;

    /**
     * Get teacher's overall revenue summary
     */
    public TeacherRevenueResponse getTeacherRevenue(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        List<PaymentTransaction> payments = paymentRepository.findByTeacherIdAndStatus(
                teacherId,
                PaymentStatus.SUCCESS
        );

        BigDecimal totalRevenue = payments.stream()
                .map(PaymentTransaction::getNetAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get revenue share config
        RevenueShareConfig revenueConfig = getDefaultRevenueConfig();
        Float revenueSharePercentage = revenueConfig.getPercentage().floatValue();

        BigDecimal teacherEarnings = payments.stream()
                .map(p -> p.getTeacherRevenue(revenueSharePercentage))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal platformFee = totalRevenue.subtract(teacherEarnings);

        long totalTransactions = payments.size();
        long totalEnrollments = payments.stream()
                .map(p -> p.getStudent().getId())
                .distinct()
                .count();

        // Calculate pending and completed payouts
        List<Payout> payouts = payoutRepository.findByTeacherId(teacherId);

        BigDecimal pendingPayout = payouts.stream()
                .filter(Payout::isPending)
                .map(Payout::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal completedPayout = payouts.stream()
                .filter(Payout::isCompleted)
                .map(Payout::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Revenue by course
        Map<String, BigDecimal> revenueByCourse = payments.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getCourse().getTitle(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                p -> p.getTeacherRevenue(revenueSharePercentage),
                                BigDecimal::add
                        )
                ));

        return TeacherRevenueResponse.builder()
                .teacherId(teacher.getId())
                .teacherName(teacher.getAccount().getUsername())
                .totalRevenue(totalRevenue)
                .teacherEarnings(teacherEarnings)
                .platformFee(platformFee)
                .revenueSharePercentage(revenueSharePercentage)
                .totalTransactions(totalTransactions)
                .totalEnrollments(totalEnrollments)
                .pendingPayout(pendingPayout)
                .completedPayout(completedPayout)
                .revenueByCourse(revenueByCourse)
                .build();
    }

    /**
     * Get my revenue (current teacher)
     */
    public TeacherRevenueResponse getMyRevenue() {
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return getTeacherRevenue(teacher.getId());
    }

    /**
     * Get detailed revenue breakdown by courses
     */
    public RevenueBreakdownResponse getRevenueBreakdown(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        List<PaymentTransaction> payments = paymentRepository.findByTeacherIdAndStatus(
                teacherId,
                PaymentStatus.SUCCESS
        );

        RevenueShareConfig revenueConfig = getDefaultRevenueConfig();
        Float revenueSharePercentage = revenueConfig.getPercentage().floatValue();

        // Group by course
        Map<Long, List<PaymentTransaction>> paymentsByCourse = payments.stream()
                .collect(Collectors.groupingBy(p -> p.getCourse().getId()));

        List<RevenueBreakdownResponse.CourseRevenueDetail> courseBreakdown =
                paymentsByCourse.entrySet().stream()
                .map(entry -> {
                    Long courseId = entry.getKey();
                    List<PaymentTransaction> coursePayments = entry.getValue();

                    PaymentTransaction firstPayment = coursePayments.get(0);

                    BigDecimal grossRevenue = coursePayments.stream()
                            .map(PaymentTransaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal netRevenue = coursePayments.stream()
                            .map(PaymentTransaction::getNetAmount)
                            .filter(java.util.Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal teacherEarnings = coursePayments.stream()
                            .map(p -> p.getTeacherRevenue(revenueSharePercentage))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal platformFee = netRevenue.subtract(teacherEarnings);

                    int totalEnrollments = (int) coursePayments.stream()
                            .map(p -> p.getStudent().getId())
                            .distinct()
                            .count();

                    return RevenueBreakdownResponse.CourseRevenueDetail.builder()
                            .courseId(courseId)
                            .courseTitle(firstPayment.getCourse().getTitle())
                            .courseThumbnail(firstPayment.getCourse().getThumbnailUrl())
                            .grossRevenue(grossRevenue)
                            .netRevenue(netRevenue)
                            .teacherEarnings(teacherEarnings)
                            .platformFee(platformFee)
                            .totalEnrollments(totalEnrollments)
                            .totalTransactions(coursePayments.size())
                            .revenueSharePercentage(revenueSharePercentage)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal totalGrossRevenue = courseBreakdown.stream()
                .map(RevenueBreakdownResponse.CourseRevenueDetail::getGrossRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNetRevenue = courseBreakdown.stream()
                .map(RevenueBreakdownResponse.CourseRevenueDetail::getNetRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTeacherEarnings = courseBreakdown.stream()
                .map(RevenueBreakdownResponse.CourseRevenueDetail::getTeacherEarnings)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPlatformFee = courseBreakdown.stream()
                .map(RevenueBreakdownResponse.CourseRevenueDetail::getPlatformFee)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return RevenueBreakdownResponse.builder()
                .teacherId(teacher.getId())
                .teacherName(teacher.getAccount().getUsername())
                .totalGrossRevenue(totalGrossRevenue)
                .totalNetRevenue(totalNetRevenue)
                .totalTeacherEarnings(totalTeacherEarnings)
                .totalPlatformFee(totalPlatformFee)
                .courseBreakdown(courseBreakdown)
                .build();
    }

    /**
     * Get my revenue breakdown (current teacher)
     */
    public RevenueBreakdownResponse getMyRevenueBreakdown() {
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return getRevenueBreakdown(teacher.getId());
    }

    /**
     * Get monthly revenue for a specific period
     */
    public MonthlyRevenueResponse getMonthlyRevenue(Long teacherId, YearMonth yearMonth) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        // Calculate date range for the month
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

        List<PaymentTransaction> payments = paymentRepository.findByTeacherIdAndDateRange(
                teacherId,
                startInstant,
                endInstant
        );

        payments = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .toList();

        RevenueShareConfig revenueConfig = getDefaultRevenueConfig();
        Float revenueSharePercentage = revenueConfig.getPercentage().floatValue();

        BigDecimal totalRevenue = payments.stream()
                .map(PaymentTransaction::getNetAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal teacherEarnings = payments.stream()
                .map(p -> p.getTeacherRevenue(revenueSharePercentage))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal platformFee = totalRevenue.subtract(teacherEarnings);

        int totalEnrollments = (int) payments.stream()
                .map(p -> p.getStudent().getId())
                .distinct()
                .count();

        // Daily revenue breakdown
        Map<String, BigDecimal> dailyRevenue = payments.stream()
                .collect(Collectors.groupingBy(
                        p -> LocalDate.ofInstant(p.getPaidAt(), ZoneId.systemDefault()).toString(),
                        LinkedHashMap::new,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                p -> p.getTeacherRevenue(revenueSharePercentage),
                                BigDecimal::add
                        )
                ));

        // Revenue by course for this month
        Map<String, BigDecimal> revenueByCourse = payments.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getCourse().getTitle(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                p -> p.getTeacherRevenue(revenueSharePercentage),
                                BigDecimal::add
                        )
                ));

        return MonthlyRevenueResponse.builder()
                .teacherId(teacher.getId())
                .teacherName(teacher.getAccount().getUsername())
                .period(yearMonth.toString())
                .totalRevenue(totalRevenue)
                .teacherEarnings(teacherEarnings)
                .platformFee(platformFee)
                .totalEnrollments(totalEnrollments)
                .totalTransactions(payments.size())
                .dailyRevenue(dailyRevenue)
                .revenueByCourse(revenueByCourse)
                .build();
    }

    /**
     * Get my monthly revenue (current teacher)
     */
    public MonthlyRevenueResponse getMyMonthlyRevenue(String period) {
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        YearMonth yearMonth = period != null ?
                YearMonth.parse(period) :
                YearMonth.now();

        return getMonthlyRevenue(teacher.getId(), yearMonth);
    }

    /**
     * Get payment transactions for teacher
     */
    public List<PaymentTransactionResponse> getTeacherPaymentTransactions(Long teacherId) {
        List<PaymentTransaction> payments = paymentRepository.findByTeacherId(teacherId);
        return payments.stream()
                .map(BillingMapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get my payment transactions (current teacher)
     */
    public List<PaymentTransactionResponse> getMyPaymentTransactions() {
        Account account = accountService.verifyCurrentAccount();
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return getTeacherPaymentTransactions(teacher.getId());
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

