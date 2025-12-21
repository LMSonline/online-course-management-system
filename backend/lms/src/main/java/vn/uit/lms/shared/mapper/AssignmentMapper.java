package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.domain.assignment.Assignment;
import vn.uit.lms.core.domain.assignment.Submission;
import vn.uit.lms.core.domain.assignment.SubmissionFile;
import vn.uit.lms.shared.dto.response.assignment.AssignmentResponse;
import vn.uit.lms.shared.dto.response.assignment.SubmissionFileResponse;
import vn.uit.lms.shared.dto.response.assignment.SubmissionResponse;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class AssignmentMapper {

    public static AssignmentResponse toResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .lessonId(assignment.getLesson() != null ? assignment.getLesson().getId() : null)
                .assignmentType(assignment.getAssignmentType())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .totalPoints(assignment.getTotalPoints())
                .timeLimitMinutes(assignment.getTimeLimitMinutes())
                .maxAttempts(assignment.getMaxAttempts())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .build();
    }

    public static SubmissionResponse toSubmissionResponse(Submission submission) {
        List<SubmissionFileResponse> files = Collections.emptyList();
        if (submission.getFiles() != null) {
            files = submission.getFiles().stream()
                    .map(AssignmentMapper::toSubmissionFileResponse)
                    .collect(Collectors.toList());
        }

        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getFullName())
                .submittedAt(submission.getSubmittedAt())
                .content(submission.getContent())
                .score(submission.getScore())
                .gradedBy(submission.getGradedBy() != null ? submission.getGradedBy().getId() : null)
                .gradedAt(submission.getGradedAt())
                .feedback(submission.getFeedback())
                .attemptNumber(submission.getAttemptNumber())
                .status(submission.getStatus())
                .files(files)
                .build();
    }

    public static SubmissionFileResponse toSubmissionFileResponse(SubmissionFile file) {
        return SubmissionFileResponse.builder()
                .id(file.getId())
//                .fileUrl(file.getFile() != null ? file.getFile().getUrl() : null)
                .fileName(file.getFile() != null ? file.getFile().getOriginalName() : null)
                .build();
    }
}
