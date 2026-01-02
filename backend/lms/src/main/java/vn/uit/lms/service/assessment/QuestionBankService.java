package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.assessment.QuestionBank;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.assessment.QuestionBankRepository;
import vn.uit.lms.service.TeacherService;
import vn.uit.lms.shared.dto.request.assessment.QuestionBankRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionBankResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.mapper.QuestionBankMapper;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for question bank management - orchestrates use cases
 * Business logic delegated to rich domain model (QuestionBank)
 */
@Service
@RequiredArgsConstructor
public class QuestionBankService {
    private final QuestionBankRepository questionBankRepository;
    private final TeacherRepository teacherRepository;
    private final TeacherService teacherService;


    /**
     * Use Case: Create question bank
     */
    @Transactional
    public QuestionBankResponse createQuestionBank(Long teacherId, QuestionBankRequest request) {
        // Load teacher
        Teacher teacher = loadTeacher(teacherId);
        teacherService.validateTeacherAccess(teacher);

        // Build question bank
        QuestionBank questionBank = QuestionBank.builder()
                .name(request.getName())
                .description(request.getDescription())
                .teacher(teacher)
                .build();

        // Use rich domain validation
        questionBank.validate();

        questionBank = questionBankRepository.save(questionBank);
        return QuestionBankMapper.toResponse(questionBank);
    }

    /**
     * Use Case: Get question banks by teacher
     */
    public List<QuestionBankResponse> getQuestionBanksByTeacher(Long teacherId) {
        return questionBankRepository.findByTeacherId(teacherId).stream()
                .map(QuestionBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get question bank by ID
     */
    public QuestionBankResponse getQuestionBankById(Long id) {
        QuestionBank questionBank = loadQuestionBank(id);
        return QuestionBankMapper.toResponse(questionBank);
    }

    /**
     * Use Case: Update question bank
     */
    @Transactional
    public QuestionBankResponse updateQuestionBank(Long id, QuestionBankRequest request) {
        QuestionBank questionBank = loadQuestionBank(id);

        // Validate ownership - teacher can only update their own question banks
        teacherService.validateTeacherAccess(questionBank.getTeacher());

        // Update fields
        questionBank.setName(request.getName());
        questionBank.setDescription(request.getDescription());

        // Use rich domain validation
        questionBank.validate();

        questionBank = questionBankRepository.save(questionBank);
        return QuestionBankMapper.toResponse(questionBank);
    }

    /**
     * Use Case: Delete question bank
     */
    @Transactional
    public void deleteQuestionBank(Long id) {
        QuestionBank questionBank = loadQuestionBank(id);

        // Validate ownership - teacher can only delete their own question banks
        teacherService.validateTeacherAccess(questionBank.getTeacher());

        // Optional: Check if bank has questions using rich domain
        if (questionBank.hasQuestions()) {
            throw new vn.uit.lms.shared.exception.InvalidRequestException(
                "Cannot delete question bank with questions. Please delete all questions first."
            );
        }

        questionBankRepository.deleteById(id);
    }

    /**
     * Use Case: Get all question banks (for admin/teacher)
     */
    public List<QuestionBankResponse> getAllQuestionBanks() {
        return questionBankRepository.findAll().stream()
                .map(QuestionBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Search question banks by name
     */
    public List<QuestionBankResponse> searchQuestionBanks(String keyword) {
        return questionBankRepository.findAll().stream()
                .filter(qb -> qb.getName().toLowerCase().contains(keyword.toLowerCase()))
                .map(QuestionBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Clone question bank
     */
    @Transactional
    public QuestionBankResponse cloneQuestionBank(Long questionBankId, Long targetTeacherId) {
        QuestionBank sourceBank = loadQuestionBank(questionBankId);
        Teacher targetTeacher = loadTeacher(targetTeacherId);

        // Create cloned bank
        QuestionBank clonedBank = QuestionBank.builder()
                .name(sourceBank.getName() + " (Copy)")
                .description(sourceBank.getDescription())
                .teacher(targetTeacher)
                .build();

        // Use rich domain validation
        clonedBank.validate();

        clonedBank = questionBankRepository.save(clonedBank);

        // Note: Questions are not automatically cloned as they reference the original bank
        // If you want to clone questions too, you'd need to implement that separately

        return QuestionBankMapper.toResponse(clonedBank);
    }

    /**
     * Use Case: Check ownership before operations (uses rich domain)
     */
    public void validateOwnership(Long bankId, Long teacherId) {
        QuestionBank bank = loadQuestionBank(bankId);

        // Use rich domain method to check ownership
        if (!bank.isOwnedBy(teacherId)) {
            throw new UnauthorizedException("You don't have permission to access this question bank");
        }
    }

    /**
     * Use Case: Get question count for a bank
     */
    public int getQuestionCount(Long bankId) {
        QuestionBank bank = loadQuestionBank(bankId);

        // Use rich domain method
        return bank.getQuestionCount();
    }


    private QuestionBank loadQuestionBank(Long id) {
        return questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));
    }

    private Teacher loadTeacher(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }
}
