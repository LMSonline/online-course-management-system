package vn.uit.lms.service.community.report;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.community.report.ViolationReport;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.community.comment.CommentRepository;
import vn.uit.lms.core.repository.community.report.ViolationReportRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.dto.request.community.report.*;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportDetailResponse;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.community.ViolationReportMapper;

import java.time.Instant;

/**
 * ViolationReportService - Orchestrates violation report business logic
 *
 * This service acts as an orchestrator, delegating domain logic to the ViolationReport entity
 * and coordinating with other services/repositories as needed.
 */
@Service
@RequiredArgsConstructor
public class ViolationReportService {

    private final ViolationReportRepository vrRepo;
    private final AccountRepository accountRepo;
    private final CourseRepository courseRepo;
    private final LessonRepository lessonRepo;
    private final CommentRepository commentRepo;
    private final AccountService accountService;

    // -------------------------
    // CREATE REPORT
    // -------------------------
    /**
     * Create a new violation report
     * Preconditions: User authenticated, valid report type and description
     * Postconditions: ViolationReport created with PENDING status
     */
    @Transactional
    public ViolationReportDetailResponse create(ViolationReportCreateRequest req) {
        // Precondition: Verify current user
        Account reporter = accountService.verifyCurrentAccount();

        // Use domain factory to create report (includes validation)
        ViolationReport vr = ViolationReport.create(reporter, req.getReportType(), req.getDescription());

        // Set optional target references
        if (req.getTargetAccountId() != null) {
            Account target = accountRepo.findById(req.getTargetAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));
            vr.setTargetAccount(target);
        }

        if (req.getCourseId() != null) {
            var course = courseRepo.findByIdAndDeletedAtIsNull(req.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            vr.setTargetCourse(course);
        }

        if (req.getLessonId() != null) {
            var lesson = lessonRepo.findById(req.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
            vr.setTargetLesson(lesson);
        }

        if (req.getCommentId() != null) {
            var comment = commentRepo.findById(req.getCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
            vr.setTargetComment(comment);
        }

        // Postcondition: Save and return
        return ViolationReportMapper.toDetail(vrRepo.save(vr));
    }

    // -------------------------
    // USER LIST REPORTS
    // -------------------------
    /**
     * Get reports created by current user
     */
    @Transactional(readOnly = true)
    public Page<ViolationReportResponse> getMyReports(Pageable pageable) {
        Account me = accountService.verifyCurrentAccount();
        return vrRepo.findByReporter(me, pageable).map(ViolationReportMapper::toResponse);
    }

    // -------------------------
    // ADMIN LIST REPORTS
    // -------------------------
    /**
     * Get all reports (Admin only)
     */
    @Transactional(readOnly = true)
    public Page<ViolationReportResponse> getAllReports(Pageable pageable) {
        return vrRepo.findAll(pageable).map(ViolationReportMapper::toResponse);
    }

    // -------------------------
    // GET REPORT DETAIL
    // -------------------------
    /**
     * Get report details
     * Preconditions: Report exists
     * Business rule: User can view their own reports, admin can view all
     */
    @Transactional(readOnly = true)
    public ViolationReportDetailResponse getById(Long id) {
        ViolationReport vr = vrRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return ViolationReportMapper.toDetail(vr);
    }

    // -------------------------
    // ADMIN: REVIEW
    // -------------------------
    /**
     * Start reviewing a report (move to IN_REVIEW status)
     * Preconditions: Report exists, status is PENDING, user is admin
     * Postconditions: Report status changed to IN_REVIEW, reviewer recorded
     */
    @Transactional
    public ViolationReportDetailResponse review(Long id, ViolationReportReviewRequest req) {
        // Precondition: Verify admin
        Account reviewer = accountService.verifyCurrentAccount();

        // Precondition: Verify report exists
        ViolationReport vr = vrRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        // Use domain method to start review (includes validation)
        vr.startReview(reviewer, req.getNote());

        // Postcondition: Save and return
        return ViolationReportMapper.toDetail(vrRepo.save(vr));
    }

    // -------------------------
    // ADMIN: DISMISS
    // -------------------------
    /**
     * Dismiss a report as invalid
     * Preconditions: Report exists, not already closed
     * Postconditions: Report status changed to DISMISSED
     */
    @Transactional
    public ViolationReportDetailResponse dismiss(Long id, ViolationReportDismissRequest req) {
        // Precondition: Verify admin
        Account reviewer = accountService.verifyCurrentAccount();

        // Precondition: Verify report exists
        ViolationReport vr = vrRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        // Use domain method to dismiss (includes validation)
        vr.dismiss(reviewer, req.getReason());

        // Postcondition: Save and return
        return ViolationReportMapper.toDetail(vrRepo.save(vr));
    }

    // -------------------------
    // ADMIN: TAKE ACTION
    // -------------------------
    /**
     * Take action on a report
     * Preconditions: Report exists, not already closed
     * Postconditions: Report status changed to ACTION_TAKEN, action executed
     *
     * Business rules:
     * - DELETE_COMMENT: Soft delete the reported comment
     * - BAN_USER: Suspend the target user account
     * - HIDE_COURSE: Close/hide the reported course
     */
    @Transactional
    public ViolationReportDetailResponse takeAction(Long id, ViolationReportTakeActionRequest req) {
        // Precondition: Verify admin
        Account reviewer = accountService.verifyCurrentAccount();

        // Precondition: Verify report exists
        ViolationReport vr = vrRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        // Execute the requested action based on action type
        executeAction(vr, req.getAction());

        // Use domain method to record action (includes validation)
        vr.takeAction(reviewer, req.getAction(), req.getNote());

        // Postcondition: Save and return
        return ViolationReportMapper.toDetail(vrRepo.save(vr));
    }

    /**
     * Execute the specified action on the report target
     */
    private void executeAction(ViolationReport vr, String action) {
        switch (action.toUpperCase()) {
            case "DELETE_COMMENT":
                if (vr.getComment() == null) {
                    throw new InvalidRequestException("Report has no comment to delete");
                }
                // Soft delete the comment
                vr.getComment().setDeletedAt(Instant.now());
                commentRepo.save(vr.getComment());
                break;

            case "BAN_USER":
                if (vr.getTarget() == null) {
                    throw new InvalidRequestException("Report has no target user to ban");
                }
                // Suspend the user account
                vr.getTarget().setStatus(AccountStatus.SUSPENDED);
                accountRepo.save(vr.getTarget());
                break;

            case "HIDE_COURSE":
                if (vr.getCourse() == null) {
                    throw new InvalidRequestException("Report has no course to hide");
                }
                // Close the course
                vr.getCourse().setIsClosed(true);
                courseRepo.save(vr.getCourse());
                break;

            case "WARNING":
                // Just record the warning - no actual system action needed
                break;

            default:
                throw new InvalidRequestException("Unknown action: " + action);
        }
    }
}
