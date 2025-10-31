package vn.uit.lms.shared.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Gender;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {

    private Long accountId;
    private String username;
    private String email;
    private String fullName;
    private AccountStatus status;
    private String avatarUrl;
    private Role role;
    private LocalDate birthday;
    private String bio;
    private Gender gender;
    private Instant lastLoginAt;
    
}
