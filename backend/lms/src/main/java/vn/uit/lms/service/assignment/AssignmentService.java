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
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.learning.EnrollmentAccessService;
import vn.uit.lms.shared.dto.request.assignment.AssignmentRequest;
import vn.uit.lms.shared.dto.response.assignment.*;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.AssignmentMapper;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Assignment Service - Manages assignment operations following DDD principles.
 *
 * IMPORTANT: Access validation is delegated to EnrollmentAccessService.
 * Business methods assume access has been validated by the caller or controller.
 *
 * Aggregate Root Pattern:
 * - Assignments belong to Lessons (composition)
 * - Should only be created/modified through proper validation
 * - Business logic delegated to rich domain models
 */
@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final SubmissionService submissionService;
    private final SubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;
    private final EnrollmentAccessService enrollmentAccessService;

    /**
     * Create assignment in a lesson (Teacher only).
     * Access validation: Teacher must own the course containing the lesson.
     */
    @Transactional
    public AssignmentResponse createAssignment(Long lessonId, AssignmentRequest request) {
        // Validate ownership - centralized access check
        Lesson lesson = enrollmentAccessService.verifyTeacherLessonOwnership(lessonId);

        // Business logic - assume access is validated
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

    /**
     * Get assignments by lesson.
     * No access validation - returns public data.
     * For sensitive operations, validate in caller.
     */
    public List<AssignmentResponse> getAssignmentsByLesson(Long lessonId) {
        return assignmentRepository.findByLessonId(lessonId).stream()
                .map(AssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get assignment by ID.
     * No access validation - returns public data.
     * For sensitive operations, validate in caller.
     */
    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = loadAssignment(id);
        return AssignmentMapper.toResponse(assignment);
    }

    /**
     * Update assignment (Teacher only).
     * Access validation: Teacher must own the assignment.
     */
    @Transactional
    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request) {
        // Validate ownership - centralized access check
        Assignment assignment = enrollmentAccessService.verifyTeacherAssignmentOwnership(id);

        // Business logic - assume access is validated
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

    /**
     * Delete assignment (Teacher only).
     * Access validation: Teacher must own the assignment.
     */
    @Transactional
    public void deleteAssignment(Long id) {
        // Validate ownership - centralized access check
        enrollmentAccessService.verifyTeacherAssignmentOwnership(id);

        // Business logic - assume access is validated
        assignmentRepository.deleteById(id);
    }

    /**
     * Get all submissions for an assignment (Teacher only).
     * Access should be validated in controller/caller.
     */
    public List<SubmissionResponse> getAssignmentSubmissions(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        return submissionService.getSubmissionsByAssignment(id);
    }

    /**
     * Check if student can submit an assignment.
     * Access validation: Student must be enrolled in the course.
     */
    public AssignmentEligibilityResponse checkEligibility(Long assignmentId) {
        // Validate enrollment - centralized access check
        enrollmentAccessService.verifyCurrentStudentAssignmentAccess(assignmentId);

        // Business logic - assume access is validated
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Assignment assignment = loadAssignment(assignmentId);
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
     * Get statistics for an assignment (Teacher only).
     * Access should be validated in controller/caller.
     */
    public AssignmentStatisticsResponse getAssignmentStatistics(Long assignmentId) {
        Assignment assignment = loadAssignment(assignmentId);
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
                .toList();

        Double averageScore = scores.isEmpty() ? null :
                scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        Double highestScore = scores.isEmpty() ? null :
                scores.stream().max(Double::compare).orElse(null);
        Double lowestScore = scores.isEmpty() ? null :
                scores.stream().min(Double::compare).orElse(null);

        int totalStudents = (int) submittedCount;
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
     * Get student's progress on an assignment.
     * Access validation: Student must be enrolled.
     */
    public StudentAssignmentProgressResponse getStudentProgress(Long assignmentId, Long studentId) {
        Assignment assignment = loadAssignment(assignmentId);
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

    /**
     * Clone assignment to another lesson (Teacher only).
     * Access validation: Teacher must own both lessons.
     */
    @Transactional
    public AssignmentResponse cloneAssignment(Long assignmentId, Long targetLessonId) {
        // Validate source assignment ownership
        Assignment sourceAssignment = enrollmentAccessService.verifyTeacherAssignmentOwnership(assignmentId);

        // Validate target lesson ownership
        Lesson targetLesson = enrollmentAccessService.verifyTeacherLessonOwnership(targetLessonId);

        // Business logic - assume access is validated
        Assignment clonedAssignment = Assignment.builder()
                .lesson(targetLesson)
                .title(sourceAssignment.getTitle() + " (Copy)")
                .description(sourceAssignment.getDescription())
                .assignmentType(sourceAssignment.getAssignmentType())
                .totalPoints(sourceAssignment.getTotalPoints())
                .timeLimitMinutes(sourceAssignment.getTimeLimitMinutes())
                .maxAttempts(sourceAssignment.getMaxAttempts())
                .dueDate(sourceAssignment.getDueDate())
                .build();

        clonedAssignment.validate();
        clonedAssignment = assignmentRepository.save(clonedAssignment);

        return AssignmentMapper.toResponse(clonedAssignment);
    }

    /**
     * Get late submissions (Teacher only).
     */
    public List<SubmissionResponse> getLateSubmissions(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found");
        }

        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .filter(Submission::isLate)
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get pending submissions (Teacher only).
     */
    public List<SubmissionResponse> getPendingSubmissions(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found");
        }

        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .filter(Submission::isPending)
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get assignments by type.
     */
    public List<AssignmentResponse> getAssignmentsByType(Long lessonId, vn.uit.lms.shared.constant.AssignmentType type) {
        return assignmentRepository.findByLessonId(lessonId).stream()
                .filter(a -> a.getAssignmentType() == type)
                .map(AssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Extend assignment due date (Teacher only).
     * Access validation: Teacher must own the assignment.
     */
    @Transactional
    public AssignmentResponse extendDueDate(Long assignmentId, java.time.Instant newDueDate) {
        // Validate ownership - centralized access check
        Assignment assignment = enrollmentAccessService.verifyTeacherAssignmentOwnership(assignmentId);

        // Business logic - assume access is validated
        if (newDueDate == null) {
            throw new InvalidRequestException("New due date cannot be null");
        }

        if (assignment.hasDueDate() && newDueDate.isBefore(assignment.getDueDate())) {
            throw new InvalidRequestException("New due date must be after current due date");
        }

        assignment.setDueDate(newDueDate);
        assignment = assignmentRepository.save(assignment);

        return AssignmentMapper.toResponse(assignment);
    }

    /* ==================== HELPER METHODS ==================== */

    /**
     * Load assignment by ID (internal use).
     * Public methods should use EnrollmentAccessService for validation.
     */
    private Assignment loadAssignment(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
    }
}

