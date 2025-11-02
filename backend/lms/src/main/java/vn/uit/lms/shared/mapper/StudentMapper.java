package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.Student;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;

public class StudentMapper {

    public static AccountProfileResponse.Profile toProfileResponse(Student student) {
        return AccountProfileResponse.Profile.builder()
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
}
