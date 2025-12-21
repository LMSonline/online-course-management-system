package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.domain.assessment.QuestionBank;
import vn.uit.lms.shared.dto.response.assessment.QuestionBankResponse;

public class QuestionBankMapper {
    public static QuestionBankResponse toResponse(QuestionBank entity) {
        return QuestionBankResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .teacherId(entity.getTeacher() != null ? entity.getTeacher().getId() : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
