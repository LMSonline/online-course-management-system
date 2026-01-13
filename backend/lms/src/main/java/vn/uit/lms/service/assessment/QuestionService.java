package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.assessment.AnswerOption;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.core.domain.assessment.QuestionBank;
import vn.uit.lms.core.domain.assessment.QuizQuestion;
import vn.uit.lms.core.repository.assessment.AnswerOptionRepository;
import vn.uit.lms.core.repository.assessment.QuestionBankRepository;
import vn.uit.lms.core.repository.assessment.QuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizQuestionRepository;
import vn.uit.lms.service.TeacherService;
import vn.uit.lms.shared.constant.QuestionType;
import vn.uit.lms.shared.dto.request.assessment.AnswerOptionRequest;
import vn.uit.lms.shared.dto.request.assessment.QuestionRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuestionMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for question management - orchestrates use cases
 * Business logic delegated to rich domain models (Question, AnswerOption)
 */
@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionBankRepository questionBankRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final TeacherService teacherService;

    /**
     * Use Case: Create question in a question bank
     */
    @Transactional
    public QuestionResponse createQuestion(Long bankId, QuestionRequest request) {
        // Load question bank
        QuestionBank bank = loadQuestionBank(bankId);

        // Validate ownership - teacher can only create questions in their own banks
        teacherService.validateTeacherAccess(bank.getTeacher());

        // Build question entity
        Question question = Question.builder()
                .content(request.getContent())
                .type(request.getType())
                .metadata(request.getMetadata())
                .maxPoints(request.getMaxPoints() != null ? request.getMaxPoints() : 1.0)
                .questionBank(bank)
                .build();





        // Add answer options using rich domain methods
        if (request.getAnswerOptions() != null && !request.getAnswerOptions().isEmpty()) {
            for (AnswerOptionRequest optionReq : request.getAnswerOptions()) {
                AnswerOption option = AnswerOption.builder()
                        .content(optionReq.getContent())
                        .isCorrect(optionReq.getIsCorrect())
                        .orderIndex(optionReq.getOrderIndex())
                        .build();

                // Use rich domain validation
                option.validate();

                // Use rich domain method to add option
                question.addAnswerOption(option);
            }

        }

        // Use rich domain validation
        question.validate();

        question = questionRepository.save(question);
        return QuestionMapper.toResponse(question);
    }

    /**
     * Use Case: Get questions by bank
     */
    public List<QuestionResponse> getQuestionsByBank(Long bankId) {
        return questionRepository.findByQuestionBankId(bankId).stream()
                .map(QuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get question by ID
     */
    public QuestionResponse getQuestionById(Long id) {
        Question question = loadQuestion(id);
        return QuestionMapper.toResponse(question);
    }

    /**
     * Use Case: Update question
     */
    @Transactional
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = loadQuestion(id);

        // Validate ownership - teacher can only update questions in their own banks
        teacherService.validateTeacherAccess(question.getQuestionBank().getTeacher());

        // Update fields
        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setMetadata(request.getMetadata());
        if (request.getMaxPoints() != null) {
            question.setMaxPoints(request.getMaxPoints());
        }

        // Update answer options if provided
        if (request.getAnswerOptions() != null) {
            updateAnswerOptionsUsingDomain(question, request.getAnswerOptions());
        }

        // Use rich domain validation
        question.validate();

        question = questionRepository.save(question);
        return QuestionMapper.toResponse(question);
    }

    /**
     * Helper method to update answer options using rich domain methods
     */
    private void updateAnswerOptionsUsingDomain(Question question, List<AnswerOptionRequest> newOptionsRequest) {
        // Get existing options
        List<AnswerOption> existingOptions = question.getAnswerOptions();

        // Use rich domain method to remove existing options
        if (existingOptions != null && !existingOptions.isEmpty()) {
            // Create copy to avoid ConcurrentModificationException
            List<AnswerOption> optionsToRemove = new ArrayList<>(existingOptions);
            for (AnswerOption option : optionsToRemove) {
                question.removeAnswerOption(option);
            }
            questionRepository.flush();
        }

        // Delete all old options from DB
        answerOptionRepository.deleteByQuestionId(question.getId());
        answerOptionRepository.flush();

        // Create and add new options using rich domain methods
        for (AnswerOptionRequest optionReq : newOptionsRequest) {
            AnswerOption option = AnswerOption.builder()
                    .content(optionReq.getContent())
                    .isCorrect(optionReq.getIsCorrect())
                    .orderIndex(optionReq.getOrderIndex())
                    .build();

            // Use rich domain validation
            option.validate();

            // Use rich domain method to add option
            question.addAnswerOption(option);
        }

        // Save new options
        answerOptionRepository.saveAll(question.getAnswerOptions());
    }

    /**
     * Use Case: Delete question
     * IMPORTANT: Handles foreign key constraints by removing quiz references first
     */
    @Transactional
    public void deleteQuestion(Long id) {
        Question question = loadQuestion(id);

        // Validate ownership - teacher can only delete questions in their own banks
        teacherService.validateTeacherAccess(question.getQuestionBank().getTeacher());

        // Check if question is being used in any quizzes
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findAll().stream()
                .filter(qq -> qq.getQuestion() != null && qq.getQuestion().getId().equals(id))
                .collect(Collectors.toList());

        if (!quizQuestions.isEmpty()) {
            // Option 1: Prevent deletion if question is in use
            throw new InvalidRequestException(
                "Cannot delete question. It is being used in " + quizQuestions.size() +
                " quiz(es). Please remove it from all quizzes first."
            );

        }

        // Now safe to delete the question
        questionRepository.deleteById(id);
    }

    /**
     * Use Case: Manage answer options for a question
     */
    @Transactional
    public QuestionResponse manageAnswerOptions(Long questionId, List<AnswerOptionRequest> optionsReq) {
        Question question = loadQuestion(questionId);

        // Use domain method to update options
        updateAnswerOptionsUsingDomain(question, optionsReq);

        // Validate question after updating options
        question.validate();

        return QuestionMapper.toResponse(question);
    }

    // ========== Helper methods for orchestration ==========

    private Question loadQuestion(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    private QuestionBank loadQuestionBank(Long id) {
        return questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));
    }

    public List<QuestionResponse> searchQuestions(Long bankId, String keyword) {
        List<Question> questions =
                questionRepository.findByQuestionBankId(bankId);

        return questions.stream()
                .filter(q -> q.getContent() != null &&
                        q.getContent().toLowerCase().contains(keyword.toLowerCase()))
                .map(QuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getQuestionsByType(
            Long bankId,
            QuestionType type
    ) {
        return questionRepository.findByQuestionBankId(bankId).stream()
                .filter(q -> q.getType() == type)
                .map(QuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionResponse cloneQuestion(
            Long questionId,
            Long targetBankId
    ) {
        Question sourceQuestion = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        QuestionBank targetBank = questionBankRepository.findById(targetBankId)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));

        Question clonedQuestion = Question.builder()
                .content(sourceQuestion.getContent())
                .type(sourceQuestion.getType())
                .metadata(sourceQuestion.getMetadata())
                .maxPoints(sourceQuestion.getMaxPoints())
                .questionBank(targetBank)
                .build();

        questionRepository.save(clonedQuestion);

        if (sourceQuestion.getAnswerOptions() != null) {
            List<AnswerOption> clonedOptions = new ArrayList<>();

            for (AnswerOption option : sourceQuestion.getAnswerOptions()) {
                AnswerOption cloned = AnswerOption.builder()
                        .content(option.getContent())
                        .isCorrect(option.isCorrect())
                        .orderIndex(option.getOrderIndex())
                        .question(clonedQuestion)
                        .build();
                clonedOptions.add(cloned);
            }

            answerOptionRepository.saveAll(clonedOptions);
            clonedQuestion.setAnswerOptions(clonedOptions);
        }

        return QuestionMapper.toResponse(clonedQuestion);
    }

    @Transactional
    public void bulkDeleteQuestions(List<Long> questionIds) {
        // Check if any questions are being used in quizzes
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findAll().stream()
                .filter(qq -> qq.getQuestion() != null && questionIds.contains(qq.getQuestion().getId()))
                .collect(Collectors.toList());

        if (!quizQuestions.isEmpty()) {
            throw new InvalidRequestException(
                "Cannot delete questions. Some questions are being used in quizzes. " +
                "Please remove them from all quizzes first."
            );
        }

        questionRepository.deleteAllById(questionIds);
    }

    @Transactional
    public QuestionResponse updateMaxPoints(
            Long questionId,
            Double maxPoints
    ) {
        if (maxPoints != null && maxPoints < 0) {
            throw new InvalidRequestException("Max points cannot be negative");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        question.setMaxPoints(maxPoints);
        questionRepository.save(question);

        return QuestionMapper.toResponse(question);
    }

    public int getQuestionCount(Long bankId) {
        return questionRepository.findByQuestionBankId(bankId).size();
    }

    /**
     * Check if a question is being used in any quizzes
     */
    public boolean isQuestionInUse(Long questionId) {
        return quizQuestionRepository.findAll().stream()
                .anyMatch(qq -> qq.getQuestion() != null && qq.getQuestion().getId().equals(questionId));
    }

    /**
     * Get list of quiz IDs where the question is being used
     */
    public List<Long> getQuizzesUsingQuestion(Long questionId) {
        return quizQuestionRepository.findAll().stream()
                .filter(qq -> qq.getQuestion() != null && qq.getQuestion().getId().equals(questionId))
                .map(qq -> qq.getQuiz().getId())
                .distinct()
                .collect(Collectors.toList());
    }
}
