package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherDetailResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherResponse;

public class TeacherMapper {

    public static AccountProfileResponse.Profile toProfileResponse(Teacher teacher) {
        return AccountProfileResponse.Profile.builder()
                .teacherId(teacher.getId())
                .teacherCode(teacher.getTeacherCode())
                .fullName(teacher.getFullName())
                .phone(teacher.getPhone())
                .birthDate(teacher.getBirthDate())
                .bio(teacher.getBio())
                .gender(teacher.getGender())
                .specialty(teacher.getSpecialty())
                .degree(teacher.getDegree())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .approved(teacher.isApproved())
                .approvedBy(teacher.getApprovedBy())
                .approvedAt(teacher.getApprovedAt())
                .rejectionReason(teacher.getRejectReason())
                .build();
    }

    public static TeacherResponse toTeacherResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .teacherCode(teacher.getTeacherCode())
                .fullName(teacher.getFullName())
                .email(teacher.getAccount() != null ? teacher.getAccount().getEmail() : null)
                .phone(teacher.getPhone())
                .birthDate(teacher.getBirthDate())
                .gender(teacher.getGender())
                .bio(teacher.getBio())
                .specialty(teacher.getSpecialty())
                .degree(teacher.getDegree())
                .avatarUrl(teacher.getAccount() != null ? teacher.getAccount().getAvatarUrl() : null)
                .approved(teacher.isApproved())
                .accountStatus(teacher.getAccount() != null ? teacher.getAccount().getStatus() : null)
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }

    public static TeacherDetailResponse toTeacherDetailResponse(Teacher teacher) {
        return TeacherDetailResponse.builder()
                .id(teacher.getId())
                .accountId(teacher.getAccount() != null ? teacher.getAccount().getId() : null)
                .teacherCode(teacher.getTeacherCode())
                .fullName(teacher.getFullName())
                .email(teacher.getAccount() != null ? teacher.getAccount().getEmail() : null)
                .username(teacher.getAccount() != null ? teacher.getAccount().getUsername() : null)
                .phone(teacher.getPhone())
                .birthDate(teacher.getBirthDate())
                .gender(teacher.getGender())
                .bio(teacher.getBio())
                .specialty(teacher.getSpecialty())
                .degree(teacher.getDegree())
                .avatarUrl(teacher.getAccount() != null ? teacher.getAccount().getAvatarUrl() : null)
                .approved(teacher.isApproved())
                .approvedBy(teacher.getApprovedBy())
                .approvedAt(teacher.getApprovedAt())
                .rejectReason(teacher.getRejectReason())
                .accountStatus(teacher.getAccount() != null ? teacher.getAccount().getStatus() : null)
                .role(teacher.getAccount() != null ? teacher.getAccount().getRole() : null)
                .lastLoginAt(teacher.getAccount() != null ? teacher.getAccount().getLastLoginAt() : null)
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }
}
