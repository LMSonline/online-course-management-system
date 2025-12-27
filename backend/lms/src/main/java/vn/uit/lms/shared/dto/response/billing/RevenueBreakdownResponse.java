package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueBreakdownResponse {

    private Long teacherId;
    private String teacherName;

    private BigDecimal totalGrossRevenue;
    private BigDecimal totalNetRevenue;
    private BigDecimal totalTeacherEarnings;
    private BigDecimal totalPlatformFee;

    private List<CourseRevenueDetail> courseBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseRevenueDetail {
        private Long courseId;
        private String courseTitle;
        private String courseThumbnail;

        private BigDecimal grossRevenue;
        private BigDecimal netRevenue;
        private BigDecimal teacherEarnings;
        private BigDecimal platformFee;

        private Integer totalEnrollments;
        private Integer totalTransactions;

        private Float revenueSharePercentage;
    }
}

