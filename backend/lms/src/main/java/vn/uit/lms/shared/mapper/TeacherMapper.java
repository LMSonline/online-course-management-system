package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;

public class TeacherMapper {

    public static AccountProfileResponse.Profile toProfileResponse(Teacher teacher) {
        return AccountProfileResponse.Profile.builder()
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
}
