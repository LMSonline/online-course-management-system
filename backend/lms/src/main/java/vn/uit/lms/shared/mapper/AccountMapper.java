package vn.uit.lms.shared.mapper;

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

    public static ResLoginDTO studentToResLoginDTO(Student student) {
        return ResLoginDTO.builder()
                .user(ResLoginDTO.UserInfo.builder()
                        .id(student.getAccount().getId())
                        .username(student.getAccount().getUsername())
                        .email(student.getAccount().getEmail())
                        .role(student.getAccount().getRole())
                        .fullName(student.getFullName())
                        .avatarUrl(student.getAvatarUrl())
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
                        .fullName(teacher.getFullName())
                        .avatarUrl(teacher.getAvatarUrl())
                        .langKey(teacher.getAccount().getLangKey())
                        .build())
                .build();
    }
}

