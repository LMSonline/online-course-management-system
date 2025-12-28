package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRevenueResponse {

    private Long teacherId;
    private String teacherName;

    private BigDecimal totalRevenue; // Total from all courses
    private BigDecimal teacherEarnings; // After platform fee
    private BigDecimal platformFee;
    private Float revenueSharePercentage;

    private Long totalTransactions;
    private Long totalEnrollments;

    private BigDecimal pendingPayout;
    private BigDecimal completedPayout;

    private Map<String, BigDecimal> revenueByCourse; // Course title -> revenue
}

