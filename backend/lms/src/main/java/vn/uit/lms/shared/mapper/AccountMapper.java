package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.Account;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.dto.request.RegisterRequest;
import vn.uit.lms.shared.dto.response.RegisterResponse;

public class AccountMapper {

    public static Account toEntity(RegisterRequest registerRequest) {
        return Account.builder()
                .email(registerRequest.getEmail())
                .role(registerRequest.getRole())
                .username(registerRequest.getUsername())
                .passwordHash(registerRequest.getPassword())
                .status(AccountStatus.PENDING_EMAIL)
                .langKey(registerRequest.getLangKey() != null ? registerRequest.getLangKey() : "en")
                .build();
    }

    public static RegisterResponse toResponse(Account account) {
        return RegisterResponse.builder()
                .id(account.getId())
                .email(account.getEmail())
                .username(account.getUsername())
                .role(account.getRole())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .langKey(account.getLangKey())
                .build();
    }
}

