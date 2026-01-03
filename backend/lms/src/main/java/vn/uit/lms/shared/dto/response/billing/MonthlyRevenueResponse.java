package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {

    private Long teacherId;
    private String teacherName;
    private String period; // YYYY-MM

    private BigDecimal totalRevenue;
    private BigDecimal teacherEarnings;
    private BigDecimal platformFee;

    private Integer totalEnrollments;
    private Integer totalTransactions;

    private Map<String, BigDecimal> dailyRevenue; // Date -> revenue
    private Map<String, BigDecimal> revenueByCourse;
}

