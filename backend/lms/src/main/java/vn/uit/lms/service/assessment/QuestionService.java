package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.assessment.AnswerOption;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.core.domain.assessment.QuestionBank;
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

        // Update answer options if provided
        if (request.getAnswerOptions() != null) {
            updateAnswerOptions(question, request.getAnswerOptions());
        }

        question = questionRepository.save(question);
        return QuestionMapper.toResponse(question);
    }

    /**
     * Helper method to properly update answer options without orphan removal errors
     */
    private void updateAnswerOptions(Question question, List<AnswerOptionRequest> newOptionsRequest) {
        // Get existing options
        List<AnswerOption> existingOptions = question.getAnswerOptions();

        if (existingOptions != null && !existingOptions.isEmpty()) {
            // Remove all existing options from the collection
            existingOptions.clear();
            // Flush to sync with DB
            questionRepository.flush();
        }

        // Delete all old options
        answerOptionRepository.deleteByQuestionId(question.getId());
        answerOptionRepository.flush();

        // Create and add new options
        List<AnswerOption> newOptions = new ArrayList<>();
        for (AnswerOptionRequest optionReq : newOptionsRequest) {
            AnswerOption option = AnswerOption.builder()
                    .content(optionReq.getContent())
                    .isCorrect(optionReq.getIsCorrect())
                    .orderIndex(optionReq.getOrderIndex())
                    .question(question)
                    .build();
            newOptions.add(option);
        }

        // Save new options
        List<AnswerOption> savedOptions = answerOptionRepository.saveAll(newOptions);

        // Update the question's collection reference
        question.setAnswerOptions(savedOptions);
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

        // Use the same helper method to avoid code duplication
        updateAnswerOptions(question, optionsReq);

        return QuestionMapper.toResponse(question);
    }

    /**
     * Search questions by content
     */
    public List<QuestionResponse> searchQuestions(Long bankId, String keyword) {
        List<Question> questions = questionRepository.findByQuestionBankId(bankId);

        return questions.stream()
                .filter(q -> q.getContent().toLowerCase().contains(keyword.toLowerCase()))
                .map(QuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get questions by type from a bank
     */
    public List<QuestionResponse> getQuestionsByType(Long bankId, vn.uit.lms.shared.constant.QuestionType type) {
        return questionRepository.findByQuestionBankId(bankId).stream()
                .filter(q -> q.getType() == type)
                .map(QuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Clone question to another bank
     */
    @Transactional
    public QuestionResponse cloneQuestion(Long questionId, Long targetBankId) {
        Question sourceQuestion = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        QuestionBank targetBank = questionBankRepository.findById(targetBankId)
                .orElseThrow(() -> new ResourceNotFoundException("Target question bank not found"));

        Question clonedQuestion = Question.builder()
                .content(sourceQuestion.getContent())
                .type(sourceQuestion.getType())
                .metadata(sourceQuestion.getMetadata())
                .maxPoints(sourceQuestion.getMaxPoints())
                .questionBank(targetBank)
                .build();

        clonedQuestion = questionRepository.save(clonedQuestion);

        // Clone answer options
        if (sourceQuestion.getAnswerOptions() != null && !sourceQuestion.getAnswerOptions().isEmpty()) {
            List<AnswerOption> clonedOptions = new ArrayList<>();
            for (AnswerOption sourceOption : sourceQuestion.getAnswerOptions()) {
                AnswerOption clonedOption = AnswerOption.builder()
                        .content(sourceOption.getContent())
                        .isCorrect(sourceOption.isCorrect())
                        .orderIndex(sourceOption.getOrderIndex())
                        .question(clonedQuestion)
                        .build();
                clonedOptions.add(clonedOption);
            }
            answerOptionRepository.saveAll(clonedOptions);
            clonedQuestion.setAnswerOptions(clonedOptions);
        }

        return QuestionMapper.toResponse(clonedQuestion);
    }

    /**
     * Bulk delete questions
     */
    @Transactional
    public void bulkDeleteQuestions(List<Long> questionIds) {
        questionRepository.deleteAllById(questionIds);
    }

    /**
     * Update question max points
     */
    @Transactional
    public QuestionResponse updateMaxPoints(Long questionId, Double maxPoints) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (maxPoints != null && maxPoints < 0) {
            throw new vn.uit.lms.shared.exception.InvalidRequestException("Max points cannot be negative");
        }

        question.setMaxPoints(maxPoints);
        question = questionRepository.save(question);

        return QuestionMapper.toResponse(question);
    }

    /**
     * Get question count for a bank
     */
    public int getQuestionCount(Long bankId) {
        return questionRepository.findByQuestionBankId(bankId).size();
    }
}

