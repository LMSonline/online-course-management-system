package vn.uit.lms.service.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.assignment.Assignment;
import vn.uit.lms.core.entity.course.content.Lesson;
import vn.uit.lms.core.repository.assignment.AssignmentRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.shared.dto.request.assignment.AssignmentRequest;
import vn.uit.lms.shared.dto.response.assignment.AssignmentResponse;
import vn.uit.lms.shared.dto.response.assignment.SubmissionResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.AssignmentMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final LessonRepository lessonRepository;
    private final SubmissionService submissionService;

    @Transactional
    public AssignmentResponse createAssignment(Long lessonId, AssignmentRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Assignment assignment = Assignment.builder()
                .lesson(lesson)
                .assignmentType(request.getAssignmentType())
                .title(request.getTitle())
                .description(request.getDescription())
                .totalPoints(request.getTotalPoints() != null ? request.getTotalPoints() : 10)
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .maxAttempts(request.getMaxAttempts() != null ? request.getMaxAttempts() : 1)
                .build();

        assignment = assignmentRepository.save(assignment);
        return AssignmentMapper.toResponse(assignment);
    }

    public List<AssignmentResponse> getAssignmentsByLesson(Long lessonId) {
        return assignmentRepository.findByLessonId(lessonId).stream()
                .map(AssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        return AssignmentMapper.toResponse(assignment);
    }

    @Transactional
    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        if (request.getAssignmentType() != null) {
            assignment.setAssignmentType(request.getAssignmentType());
        }
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        if (request.getTotalPoints() != null) {
            assignment.setTotalPoints(request.getTotalPoints());
        }
        if (request.getTimeLimitMinutes() != null) {
            assignment.setTimeLimitMinutes(request.getTimeLimitMinutes());
        }
        if (request.getMaxAttempts() != null) {
            assignment.setMaxAttempts(request.getMaxAttempts());
        }

        assignment = assignmentRepository.save(assignment);
        return AssignmentMapper.toResponse(assignment);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        assignmentRepository.deleteById(id);
    }

    public List<SubmissionResponse> getAssignmentSubmissions(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        return submissionService.getSubmissionsByAssignment(id);
    }
}
