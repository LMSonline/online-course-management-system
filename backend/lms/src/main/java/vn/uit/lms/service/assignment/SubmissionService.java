package vn.uit.lms.service.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assignment.Assignment;
import vn.uit.lms.core.domain.assignment.Submission;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assignment.AssignmentRepository;
import vn.uit.lms.core.repository.assignment.SubmissionRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.SubmissionStatus;
import vn.uit.lms.shared.dto.request.assignment.FeedbackSubmissionRequest;
import vn.uit.lms.shared.dto.request.assignment.GradeSubmissionRequest;
import vn.uit.lms.shared.dto.response.assignment.SubmissionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.AssignmentMapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;
    private final SubmissionFileService submissionFileService;

    @Transactional
    public SubmissionResponse submitAssignment(Long assignmentId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        // Count existing attempts by this student
        List<Submission> existingSubmissions = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, student.getId());
        int attemptCount = existingSubmissions.size();

        // Check if student can submit using rich domain logic
        if (!assignment.canSubmit(attemptCount)) {
            if (assignment.isPastDue()) {
                throw new InvalidRequestException("Assignment is past due date");
            } else {
                throw new InvalidRequestException("Maximum attempts reached for this assignment");
            }
        }

        // If there's a pending submission, don't allow new one
        boolean hasPendingSubmission = existingSubmissions.stream()
                .anyMatch(Submission::isPending);
        if (hasPendingSubmission && !assignment.allowsMultipleAttempts()) {
            throw new InvalidRequestException("You already have a pending submission for this assignment");
        }

        Submission submission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .submittedAt(Instant.now())
                .attemptNumber(attemptCount + 1)
                .status(SubmissionStatus.PENDING)
                .build();

        // Validate using rich domain logic
        submission.validate();

        submission = submissionRepository.save(submission);
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    public List<SubmissionResponse> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    public SubmissionResponse getSubmissionById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    @Transactional
    public SubmissionResponse gradeSubmission(Long id, GradeSubmissionRequest request) {
        Account account = accountService.verifyCurrentAccount();
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Use rich domain logic to grade
        submission.grade(request.getGrade(), account, request.getFeedback());

        submission = submissionRepository.save(submission);
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    @Transactional
    public SubmissionResponse feedbackSubmission(Long id, FeedbackSubmissionRequest request) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Use rich domain logic to add feedback
        submission.addFeedback(request.getFeedback());

        submission = submissionRepository.save(submission);
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    public List<SubmissionResponse> getStudentSubmissions(Long studentId) {
        return submissionRepository.findByStudentId(studentId).stream()
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSubmission(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        // Validate ownership - student can only delete their own submission
        Account currentAccount = accountService.verifyCurrentAccount();
        Student currentStudent = studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (!submission.getStudent().getId().equals(currentStudent.getId())) {
            throw new vn.uit.lms.shared.exception.UnauthorizedException("You can only delete your own submissions");
        }

        // Check if submission can be edited using rich domain logic
        if (!submission.canBeEdited()) {
            throw new InvalidRequestException("Cannot delete a graded or rejected submission");
        }
        
        // Delete all associated files first
        submissionFileService.deleteAllSubmissionFiles(id);

        submissionRepository.deleteById(id);
    }

    /**
     * Get submission count for a student on an assignment
     */
    public int getSubmissionCount(Long assignmentId, Long studentId) {
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId).size();
    }

    /**
     * Update submission content (before grading)
     */
    @Transactional
    public SubmissionResponse updateSubmissionContent(Long id, String content) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Validate ownership - student can only update their own submission
        Account currentAccount = accountService.verifyCurrentAccount();
        Student currentStudent = studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (!submission.getStudent().getId().equals(currentStudent.getId())) {
            throw new vn.uit.lms.shared.exception.UnauthorizedException("You can only update your own submissions");
        }

        // Check if submission can be edited using rich domain logic
        if (!submission.canBeEdited()) {
            throw new InvalidRequestException("Cannot update a graded or rejected submission");
        }

        submission.setContent(content);
        submission = submissionRepository.save(submission);
        
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    /**
     * Get my submissions for an assignment (current student)
     */
    public List<SubmissionResponse> getMySubmissions(Long assignmentId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId()).stream()
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Resubmit assignment (create new submission with content from previous)
     */
    @Transactional
    public SubmissionResponse resubmitAssignment(Long assignmentId, Long previousSubmissionId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Submission previousSubmission = submissionRepository.findById(previousSubmissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Previous submission not found"));

        // Verify ownership
        if (!previousSubmission.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("Previous submission does not belong to you");
        }

        // Count existing attempts
        List<Submission> existingSubmissions = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, student.getId());
        int attemptCount = existingSubmissions.size();

        // Check if student can submit using rich domain logic
        if (!assignment.canSubmit(attemptCount)) {
            if (assignment.isPastDue()) {
                throw new InvalidRequestException("Assignment is past due date");
            } else {
                throw new InvalidRequestException("Maximum attempts reached for this assignment");
            }
        }

        Submission newSubmission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .submittedAt(Instant.now())
                .content(previousSubmission.getContent())
                .attemptNumber(attemptCount + 1)
                .status(SubmissionStatus.PENDING)
                .build();

        newSubmission.validate();
        newSubmission = submissionRepository.save(newSubmission);
        
        return AssignmentMapper.toSubmissionResponse(newSubmission);
    }

    /**
     * Bulk grade submissions (for teachers)
     */
    @Transactional
    public List<SubmissionResponse> bulkGradeSubmissions(List<Long> submissionIds, Double score, String feedback) {
        Account account = accountService.verifyCurrentAccount();
        
        List<Submission> submissions = submissionRepository.findAllById(submissionIds);
        
        if (submissions.size() != submissionIds.size()) {
            throw new ResourceNotFoundException("Some submissions not found");
        }

        List<Submission> gradedSubmissions = new ArrayList<>();
        for (Submission submission : submissions) {
            submission.grade(score, account, feedback);
            gradedSubmissions.add(submission);
        }

        submissionRepository.saveAll(gradedSubmissions);
        
        return gradedSubmissions.stream()
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Reject submission (for teachers)
     */
    @Transactional
    public SubmissionResponse rejectSubmission(Long id, String feedback) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Use rich domain logic to reject
        submission.reject(feedback);

        submission = submissionRepository.save(submission);
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    /**
     * Get submissions by status for an assignment (for teachers)
     */
    public List<SubmissionResponse> getSubmissionsByStatus(Long assignmentId, SubmissionStatus status) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found");
        }

        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .filter(s -> s.getStatus() == status)
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all late submissions by student
     */
    public List<SubmissionResponse> getLateSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId).stream()
                .filter(Submission::isLate)
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get best submission for student on an assignment
     */
    public SubmissionResponse getBestSubmission(Long assignmentId, Long studentId) {
        List<Submission> submissions = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);

        Submission bestSubmission = submissions.stream()
                .filter(Submission::isGraded)
                .filter(s -> s.getScore() != null)
                .max((s1, s2) -> Double.compare(s1.getScore(), s2.getScore()))
                .orElseThrow(() -> new ResourceNotFoundException("No graded submission found"));

        return AssignmentMapper.toSubmissionResponse(bestSubmission);
    }

    /**
     * Get average score for a student across all assignments
     */
    public Double getStudentAverageScore(Long studentId) {
        List<Submission> gradedSubmissions = submissionRepository.findByStudentId(studentId).stream()
                .filter(Submission::isGraded)
                .filter(s -> s.getScore() != null)
                .collect(Collectors.toList());

        if (gradedSubmissions.isEmpty()) {
            return null;
        }

        return gradedSubmissions.stream()
                .mapToDouble(Submission::getScore)
                .average()
                .orElse(0.0);
    }

    /**
     * Regrade submission with new score (for teachers)
     */
    @Transactional
    public SubmissionResponse regradeSubmission(Long id, Double newScore, String feedback) {
        Account account = accountService.verifyCurrentAccount();
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Use rich domain logic to grade (works for both new grading and regrading)
        submission.grade(newScore, account, feedback);

        submission = submissionRepository.save(submission);
        return AssignmentMapper.toSubmissionResponse(submission);
    }

    /**
     * Get passing rate for an assignment
     */
    public Double getPassingRate(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found");
        }

        List<Submission> gradedSubmissions = submissionRepository.findByAssignmentId(assignmentId).stream()
                .filter(Submission::isGraded)
                .collect(Collectors.toList());

        if (gradedSubmissions.isEmpty()) {
            return null;
        }

        long passingCount = gradedSubmissions.stream()
                .filter(Submission::isPassing)
                .count();

        return (passingCount * 100.0) / gradedSubmissions.size();
    }

    /**
     * Get submission summary for current student
     */
    public SubmissionResponse getMyLatestSubmission(Long assignmentId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<Submission> submissions = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId());

        Submission latestSubmission = submissions.stream()
                .max((s1, s2) -> s1.getSubmittedAt().compareTo(s2.getSubmittedAt()))
                .orElseThrow(() -> new ResourceNotFoundException("No submission found"));

        return AssignmentMapper.toSubmissionResponse(latestSubmission);
    }

    /**
     * Export submission data for an assignment (for analytics/reporting)
     */
    public List<SubmissionResponse> exportAssignmentSubmissions(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found");
        }

        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .sorted((s1, s2) -> {
                    // Sort by student name, then by attempt number
                    int nameComparison = s1.getStudent().getFullName()
                            .compareTo(s2.getStudent().getFullName());
                    if (nameComparison != 0) {
                        return nameComparison;
                    }
                    return s1.getAttemptNumber().compareTo(s2.getAttemptNumber());
                })
                .map(AssignmentMapper::toSubmissionResponse)
                .collect(Collectors.toList());
    }
}
