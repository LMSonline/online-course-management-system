package vn.uit.lms.shared.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {

    private Long accountId;
    private String username;
    private String email;
    private Role role;
    private AccountStatus status;
    private String avatarUrl;
    private Instant lastLoginAt;
    private Instant createdAt;

}
