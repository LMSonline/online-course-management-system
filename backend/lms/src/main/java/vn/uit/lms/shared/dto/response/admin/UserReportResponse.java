package vn.uit.lms.shared.dto.response.admin;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserReportResponse {

    private Long totalUsers;
    private Long newUsers;
    private Long activeUsers;
}
