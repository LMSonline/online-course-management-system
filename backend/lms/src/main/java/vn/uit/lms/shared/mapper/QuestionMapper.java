package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.domain.assessment.AnswerOption;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.shared.dto.response.assessment.AnswerOptionResponse;
import vn.uit.lms.shared.dto.response.assessment.QuestionResponse;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionMapper {

    public static QuestionResponse toResponse(Question question) {
        List<AnswerOptionResponse> options = Collections.emptyList();
        if (question.getAnswerOptions() != null) {
            options = question.getAnswerOptions().stream()
                    .map(QuestionMapper::toAnswerOptionResponse)
                    .collect(Collectors.toList());
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .content(question.getContent())
                .type(question.getType())
                .metadata(question.getMetadata())
                .maxPoints(question.getMaxPoints())
                .questionBankId(question.getQuestionBank() != null ? question.getQuestionBank().getId() : null)
                .answerOptions(options)
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }

    public static AnswerOptionResponse toAnswerOptionResponse(AnswerOption option) {
        return AnswerOptionResponse.builder()
                .id(option.getId())
                .content(option.getContent())
                .isCorrect(option.isCorrect())
                .orderIndex(option.getOrderIndex())
                .build();
    }
}
