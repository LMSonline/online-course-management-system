package vn.uit.lms.shared.dto.response.admin;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RevenueReportResponse {

    private String period;
    private Long totalRevenue;
    private Long totalTransactions;
}
