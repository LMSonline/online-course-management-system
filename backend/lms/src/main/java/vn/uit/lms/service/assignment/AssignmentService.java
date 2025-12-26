package vn.uit.lms.service.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assignment.Assignment;
import vn.uit.lms.core.domain.assignment.Submission;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assignment.AssignmentRepository;
import vn.uit.lms.core.repository.assignment.SubmissionRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.dto.request.assignment.AssignmentRequest;
import vn.uit.lms.shared.dto.response.assignment.*;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.AssignmentMapper;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final LessonRepository lessonRepository;
    private final SubmissionService submissionService;
    private final SubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;

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
                .dueDate(request.getDueDate())
                .build();

        // Validate using rich domain logic
        assignment.validate();

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
        if (request.getDueDate() != null) {
            assignment.setDueDate(request.getDueDate());
        }

        // Validate using rich domain logic
        assignment.validate();

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

    /**
     * Get assignment with submission eligibility info for a student
     */
    public Assignment getAssignmentEntity(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
    }

    /**
     * Check if a student can submit an assignment
     */
    public AssignmentEligibilityResponse checkEligibility(Long assignmentId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Assignment assignment = getAssignmentEntity(assignmentId);
        List<Submission> submissions = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId());
        int attemptCount = submissions.size();

        boolean canSubmit = assignment.canSubmit(attemptCount);
        String reason = null;
        
        if (!canSubmit) {
            if (assignment.isPastDue()) {
                reason = "Assignment is past due date";
            } else {
                reason = "Maximum attempts reached for this assignment";
            }
        }

        return AssignmentEligibilityResponse.builder()
                .assignmentId(assignment.getId())
                .assignmentTitle(assignment.getTitle())
                .canSubmit(canSubmit)
                .currentAttempts(attemptCount)
                .maxAttempts(assignment.getMaxAttempts())
                .remainingAttempts(assignment.getRemainingAttempts(attemptCount))
                .isPastDue(assignment.isPastDue())
                .reason(reason)
                .build();
    }

    /**
     * Get statistics for an assignment (for teachers)
     */
    public AssignmentStatisticsResponse getAssignmentStatistics(Long assignmentId) {
        Assignment assignment = getAssignmentEntity(assignmentId);
        List<Submission> submissions = submissionRepository.findByAssignmentId(assignmentId);

        // Count unique students who submitted
        long submittedCount = submissions.stream()
                .map(s -> s.getStudent().getId())
                .distinct()
                .count();

        long gradedCount = submissions.stream()
                .filter(Submission::isGraded)
                .count();

        long pendingCount = submissions.stream()
                .filter(Submission::isPending)
                .count();

        // Calculate score statistics from graded submissions
        List<Double> scores = submissions.stream()
                .filter(Submission::isGraded)
                .map(Submission::getScore)
                .filter(score -> score != null)
                .collect(Collectors.toList());

        Double averageScore = scores.isEmpty() ? null : 
                scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        Double highestScore = scores.isEmpty() ? null :
                scores.stream().max(Double::compare).orElse(null);
        Double lowestScore = scores.isEmpty() ? null :
                scores.stream().min(Double::compare).orElse(null);

        // For total students, ideally should come from course enrollment
        // For now, use submitted count as total (assuming only students who submitted are counted)
        // In production, this should be retrieved from course enrollment data
        int totalStudents = (int) submittedCount;
        // Submission rate would be meaningful if we had actual enrollment count
        // Setting to 100% as all counted students have submitted (by definition)
        Double submissionRate = 100.0;

        return AssignmentStatisticsResponse.builder()
                .assignmentId(assignment.getId())
                .assignmentTitle(assignment.getTitle())
                .totalStudents(totalStudents)
                .submittedCount((int) submittedCount)
                .gradedCount((int) gradedCount)
                .pendingCount((int) pendingCount)
                .averageScore(averageScore)
                .highestScore(highestScore)
                .lowestScore(lowestScore)
                .submissionRate(submissionRate)
                .build();
    }

    /**
     * Get student's progress on an assignment
     */
    public StudentAssignmentProgressResponse getStudentProgress(Long assignmentId, Long studentId) {
        Assignment assignment = getAssignmentEntity(assignmentId);
        List<Submission> submissions = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);

        boolean hasSubmitted = !submissions.isEmpty();
        int attemptCount = submissions.size();

        Submission latestSubmission = submissions.stream()
                .max(Comparator.comparing(Submission::getSubmittedAt))
                .orElse(null);

        Double bestScore = submissions.stream()
                .filter(Submission::isGraded)
                .map(Submission::getScore)
                .filter(score -> score != null)
                .max(Double::compare)
                .orElse(null);

        boolean isPassing = latestSubmission != null && latestSubmission.isPassing();

        return StudentAssignmentProgressResponse.builder()
                .assignmentId(assignment.getId())
                .assignmentTitle(assignment.getTitle())
                .totalPoints(assignment.getTotalPoints())
                .dueDate(assignment.getDueDate())
                .hasSubmitted(hasSubmitted)
                .attemptCount(attemptCount)
                .latestSubmissionId(latestSubmission != null ? latestSubmission.getId() : null)
                .latestSubmissionStatus(latestSubmission != null ? latestSubmission.getStatus().name() : null)
                .latestScore(latestSubmission != null ? latestSubmission.getScore() : null)
                .bestScore(bestScore)
                .isPassing(isPassing)
                .build();
    }
}
