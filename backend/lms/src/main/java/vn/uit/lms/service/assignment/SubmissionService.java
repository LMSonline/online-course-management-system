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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;

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
        
        // Check if submission can be edited using rich domain logic
        if (!submission.canBeEdited()) {
            throw new InvalidRequestException("Cannot delete a graded or rejected submission");
        }
        
        submissionRepository.deleteById(id);
    }

    /**
     * Get submission count for a student on an assignment
     */
    public int getSubmissionCount(Long assignmentId, Long studentId) {
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId).size();
    }
}
