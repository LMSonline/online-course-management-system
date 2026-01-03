package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePaymentStatsResponse {

    private Long courseId;
    private String courseTitle;
    private Long teacherId;
    private String teacherName;

    private Long totalTransactions;
    private Long successfulTransactions;
    private Long failedTransactions;
    private Long refundedTransactions;

    private BigDecimal totalRevenue;
    private BigDecimal totalRefunded;
    private BigDecimal netRevenue;

    private BigDecimal teacherRevenue; // After platform fee
    private BigDecimal platformRevenue;

    private Float revenueSharePercentage;
}

