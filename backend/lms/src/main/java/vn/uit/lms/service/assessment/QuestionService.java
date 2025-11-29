package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.assessment.AnswerOption;
import vn.uit.lms.core.entity.assessment.Question;
import vn.uit.lms.core.entity.assessment.QuestionBank;
import vn.uit.lms.core.repository.assessment.AnswerOptionRepository;
import vn.uit.lms.core.repository.assessment.QuestionBankRepository;
import vn.uit.lms.core.repository.assessment.QuestionRepository;
import vn.uit.lms.shared.dto.request.assessment.AnswerOptionRequest;
import vn.uit.lms.shared.dto.request.assessment.QuestionRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuestionMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionBankRepository questionBankRepository;
    private final AnswerOptionRepository answerOptionRepository;

    @Transactional
    public QuestionResponse createQuestion(Long bankId, QuestionRequest request) {
        QuestionBank bank = questionBankRepository.findById(bankId)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));

        Question question = Question.builder()
                .content(request.getContent())
                .type(request.getType())
                .metadata(request.getMetadata())
                .maxPoints(request.getMaxPoints() != null ? request.getMaxPoints() : 1.0)
                .questionBank(bank)
                .build();

        question = questionRepository.save(question);

        if (request.getAnswerOptions() != null && !request.getAnswerOptions().isEmpty()) {
            List<AnswerOption> options = new ArrayList<>();
            for (AnswerOptionRequest optionReq : request.getAnswerOptions()) {
                AnswerOption option = AnswerOption.builder()
                        .content(optionReq.getContent())
                        .isCorrect(optionReq.getIsCorrect())
                        .orderIndex(optionReq.getOrderIndex())
                        .question(question)
                        .build();
                options.add(option);
            }
            answerOptionRepository.saveAll(options);
            question.setAnswerOptions(options);
        }

        return QuestionMapper.toResponse(question);
    }

    public List<QuestionResponse> getQuestionsByBank(Long bankId) {
        return questionRepository.findByQuestionBankId(bankId).stream()
                .map(QuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        return QuestionMapper.toResponse(question);
    }

    @Transactional
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setMetadata(request.getMetadata());
        if (request.getMaxPoints() != null) {
            question.setMaxPoints(request.getMaxPoints());
        }

        // Update options if provided? Or just question details?
        // Usually updateQuestion might update options too, but we have manageAnswerOptions.
        // Let's assume this updates basic info, and if options are provided, it replaces them?
        // For simplicity, let's stick to basic info update here, or full replacement if options provided.
        // Given manageAnswerOptions exists, maybe this just updates content/type.
        // But if the user sends options, we should probably handle it.

        // Ý nó nói là có nên update tất cả options không?

        if (request.getAnswerOptions() != null) {
            // Clear existing options
            answerOptionRepository.deleteByQuestionId(id);

            List<AnswerOption> options = new ArrayList<>();
            for (AnswerOptionRequest optionReq : request.getAnswerOptions()) {
                AnswerOption option = AnswerOption.builder()
                        .content(optionReq.getContent())
                        .isCorrect(optionReq.getIsCorrect())
                        .orderIndex(optionReq.getOrderIndex())
                        .question(question)
                        .build();
                options.add(option);
            }
            answerOptionRepository.saveAll(options);
            question.setAnswerOptions(options);
        }

        question = questionRepository.save(question);
        return QuestionMapper.toResponse(question);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found");
        }
        questionRepository.deleteById(id);
    }

    @Transactional
    public QuestionResponse manageAnswerOptions(Long questionId, List<AnswerOptionRequest> optionsReq) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        // This method could be "replace all options" or "add/update".
        // Based on the name "manage", and typical REST patterns, POST to .../answer-options might mean adding or replacing.
        // Let's assume it replaces all options for simplicity and consistency with "managing" the set.

        answerOptionRepository.deleteByQuestionId(questionId);

        List<AnswerOption> options = new ArrayList<>();
        for (AnswerOptionRequest optionReq : optionsReq) {
            AnswerOption option = AnswerOption.builder()
                    .content(optionReq.getContent())
                    .isCorrect(optionReq.getIsCorrect())
                    .orderIndex(optionReq.getOrderIndex())
                    .question(question)
                    .build();
            options.add(option);
        }
        answerOptionRepository.saveAll(options);
        question.setAnswerOptions(options);

        return QuestionMapper.toResponse(question);
    }
}
