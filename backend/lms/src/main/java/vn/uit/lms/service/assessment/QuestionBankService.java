package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.assessment.QuestionBank;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.assessment.QuestionBankRepository;
import vn.uit.lms.shared.dto.request.assessment.QuestionBankRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionBankResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuestionBankMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionBankService {
    private final QuestionBankRepository questionBankRepository;
    private final TeacherRepository teacherRepository;

    @Transactional
    public QuestionBankResponse createQuestionBank(Long teacherId, QuestionBankRequest request) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        QuestionBank questionBank = QuestionBank.builder()
                .name(request.getName())
                .description(request.getDescription())
                .teacher(teacher)
                .build();

        questionBank = questionBankRepository.save(questionBank);
        return QuestionBankMapper.toResponse(questionBank);
    }

    public List<QuestionBankResponse> getQuestionBanksByTeacher(Long teacherId) {
        return questionBankRepository.findByTeacherId(teacherId).stream()
                .map(QuestionBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    public QuestionBankResponse getQuestionBankById(Long id) {
        QuestionBank questionBank = questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));
        return QuestionBankMapper.toResponse(questionBank);
    }

    @Transactional
    public QuestionBankResponse updateQuestionBank(Long id, QuestionBankRequest request) {
        QuestionBank questionBank = questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));

        questionBank.setName(request.getName());
        questionBank.setDescription(request.getDescription());

        questionBank = questionBankRepository.save(questionBank);
        return QuestionBankMapper.toResponse(questionBank);
    }

    @Transactional
    public void deleteQuestionBank(Long id) {
        if (!questionBankRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question bank not found");
        }
        questionBankRepository.deleteById(id);
    }

    /**
     * Get all question banks (for admin/teacher)
     */
    public List<QuestionBankResponse> getAllQuestionBanks() {
        return questionBankRepository.findAll().stream()
                .map(QuestionBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search question banks by name
     */
    public List<QuestionBankResponse> searchQuestionBanks(String keyword) {
        return questionBankRepository.findAll().stream()
                .filter(qb -> qb.getName().toLowerCase().contains(keyword.toLowerCase()))
                .map(QuestionBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Clone question bank (for teachers)
     */
    @Transactional
    public QuestionBankResponse cloneQuestionBank(Long questionBankId, Long targetTeacherId) {
        QuestionBank sourceBank = questionBankRepository.findById(questionBankId)
                .orElseThrow(() -> new ResourceNotFoundException("Question bank not found"));

        Teacher targetTeacher = teacherRepository.findById(targetTeacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Target teacher not found"));

        QuestionBank clonedBank = QuestionBank.builder()
                .name(sourceBank.getName() + " (Copy)")
                .description(sourceBank.getDescription())
                .teacher(targetTeacher)
                .build();

        clonedBank = questionBankRepository.save(clonedBank);

        // Note: Questions are not automatically cloned as they reference the original bank
        // If you want to clone questions too, you'd need to implement that separately

        return QuestionBankMapper.toResponse(clonedBank);
    }
}
