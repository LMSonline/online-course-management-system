package vn.uit.lms.shared.mapper;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.request.RegisterRequest;
import vn.uit.lms.shared.dto.response.RegisterResponse;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.account.AccountResponse;


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
                .avatarUrl(account.getAvatarUrl())
                .createdAt(account.getCreatedAt())
                .langKey(account.getLangKey())
                .build();
    }

    public static ResLoginDTO studentToResLoginDTO(Student student) {
        return ResLoginDTO.builder()
                .user(ResLoginDTO.UserInfo.builder()
                        .id(student.getAccount().getId())
                        .username(student.getAccount().getUsername())
                        .email(student.getAccount().getEmail())
                        .role(student.getAccount().getRole())
                        .fullName(student.getFullName())
                        .avatarUrl(student.getAccount().getAvatarUrl())
                        .langKey(student.getAccount().getLangKey())
                        .build())
                .build();
    }

    public static ResLoginDTO teacherToResLoginDTO(Teacher teacher) {
        return ResLoginDTO.builder()
                .user(ResLoginDTO.UserInfo.builder()
                        .id(teacher.getAccount().getId())
                        .username(teacher.getAccount().getUsername())
                        .email(teacher.getAccount().getEmail())
                        .role(teacher.getAccount().getRole())
                        .avatarUrl(teacher.getAccount().getAvatarUrl())
                        .fullName(teacher.getFullName())
                        .langKey(teacher.getAccount().getLangKey())
                        .build())
                .build();
    }

    public static ResLoginDTO adminToResLoginDTO( Account admin) {
        return ResLoginDTO.builder()
                .user(ResLoginDTO.UserInfo.builder()
                        .id(admin.getId())
                        .username(admin.getUsername())
                        .email(admin.getEmail())
                        .role(admin.getRole())
                        .avatarUrl(admin.getAvatarUrl())
                        .langKey(admin.getLangKey())
                        .build())
                .build();
    }

    public static AccountProfileResponse toProfileResponse(Account account, AccountProfileResponse.Profile profile) {
        return AccountProfileResponse.builder()
                .accountId(account.getId())
                .lastLoginAt(account.getLastLoginAt())
                .email(account.getEmail())
                .username(account.getUsername())
                .role(account.getRole())
                .status(account.getStatus())
                .avatarUrl(account.getAvatarUrl())
                .profile(profile)
                .build();
    }

    public static AccountResponse toAccountResponse(Account account) {
        return AccountResponse.builder()
                .accountId(account.getId())
                .username(account.getUsername())
                .email(account.getEmail())
                .role(account.getRole())
                .status(account.getStatus())
                .avatarUrl(account.getAvatarUrl())
                .lastLoginAt(account.getLastLoginAt())
                .createdAt(account.getCreatedAt())
                .build();
    }


}

