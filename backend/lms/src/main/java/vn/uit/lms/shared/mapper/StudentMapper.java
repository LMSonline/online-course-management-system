package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.domain.Student;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.student.StudentDetailResponse;
import vn.uit.lms.shared.dto.response.student.StudentResponse;

public class StudentMapper {

    public static AccountProfileResponse.Profile toProfileResponse(Student student) {
        return AccountProfileResponse.Profile.builder()
                .studentId(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .phone(student.getPhone())
                .birthDate(student.getBirthDate())
                .bio(student.getBio())
                .gender(student.getGender())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public static StudentResponse toStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .email(student.getAccount() != null ? student.getAccount().getEmail() : null)
                .phone(student.getPhone())
                .birthDate(student.getBirthDate())
                .gender(student.getGender())
                .bio(student.getBio())
                .avatarUrl(student.getAccount() != null ? student.getAccount().getAvatarUrl() : null)
                .accountStatus(student.getAccount() != null ? student.getAccount().getStatus() : null)
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public static StudentDetailResponse toStudentDetailResponse(Student student) {
        return StudentDetailResponse.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .email(student.getAccount() != null ? student.getAccount().getEmail() : null)
                .username(student.getAccount() != null ? student.getAccount().getUsername() : null)
                .phone(student.getPhone())
                .birthDate(student.getBirthDate())
                .gender(student.getGender())
                .bio(student.getBio())
                .avatarUrl(student.getAccount() != null ? student.getAccount().getAvatarUrl() : null)
                .accountStatus(student.getAccount() != null ? student.getAccount().getStatus() : null)
                .role(student.getAccount() != null ? student.getAccount().getRole() : null)
                .lastLoginAt(student.getAccount() != null ? student.getAccount().getLastLoginAt() : null)
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .accountId(student.getAccount() != null ? student.getAccount().getId() : null)
                .build();
    }
}

