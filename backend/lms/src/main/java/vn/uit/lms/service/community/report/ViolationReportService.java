package vn.uit.lms.service.community.report;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.community.comment.Comment;
import vn.uit.lms.core.entity.community.report.ViolationReport;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.community.comment.CommentRepository;
import vn.uit.lms.core.repository.community.report.ViolationReportRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.ViolationReportStatus;
import vn.uit.lms.shared.dto.request.community.report.*;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportDetailResponse;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.community.ViolationReportMapper;

import java.time.Instant;

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
    @Transactional
    public ViolationReportDetailResponse create(ViolationReportCreateRequest req) {

        Account reporter = accountService.verifyCurrentAccount();

        ViolationReport vr = new ViolationReport();
        vr.setReporter(reporter);

        // optional fields
        if (req.getTargetAccountId() != null) {
            vr.setTarget(accountRepo.findById(req.getTargetAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target user not found")));
        }

        if (req.getCourseId() != null) {
            vr.setCourse(courseRepo.findByIdAndDeletedAtIsNull(req.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found")));
        }

//        if (req.getLessonId() != null) {
//            vr.setLesson(lessonRepo.findByIdAndDeletedAtIsNull(req.getLessonId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found")));
//        }

        if (req.getCommentId() != null) {
            vr.setComment(commentRepo.findById(req.getCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found")));
        }

        vr.setReportType(req.getReportType());
        vr.setDescription(req.getDescription());
        vr.setStatus(ViolationReportStatus.PENDING);

        return ViolationReportMapper.toDetail(vrRepo.save(vr));
    }

    // -------------------------
    // USER LIST REPORTS
    // -------------------------
    public Page<ViolationReportResponse> getMyReports(Pageable pageable) {
        Account me = accountService.verifyCurrentAccount();
        return vrRepo.findByReporter(me, pageable).map(ViolationReportMapper::toResponse);
    }

    // -------------------------
    // ADMIN LIST REPORTS
    // -------------------------
    public Page<ViolationReportResponse> getAllReports(Pageable pageable) {
        return vrRepo.findAll(pageable).map(ViolationReportMapper::toResponse);
    }

    // -------------------------
    // GET REPORT DETAIL
    // -------------------------
    public ViolationReportDetailResponse getById(Long id) {
        ViolationReport vr = vrRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return ViolationReportMapper.toDetail(vr);
    }

//    // -------------------------
//    // ADMIN: REVIEW
//    // -------------------------
//    @Transactional
//    public ViolationReportDetailResponse review(Long id, ViolationReportReviewRequest req) {
//        ViolationReport vr = vrRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
//
//        vr.setStatus(ViolationReportStatus.IN_REVIEW);
//        vr.setAdminNote(req.getNote());
//
//        return ViolationReportMapper.toDetail(vrRepo.save(vr));
//    }
//
//    // -------------------------
//    // ADMIN: DISMISS
//    // -------------------------
//    @Transactional
//    public ViolationReportDetailResponse dismiss(Long id, ViolationReportDismissRequest req) {
//        ViolationReport vr = vrRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
//
//        vr.setStatus(ViolationReportStatus.DISMISSED);
//        vr.setAdminNote(req.getReason());
//
//        return ViolationReportMapper.toDetail(vrRepo.save(vr));
//    }

//    // -------------------------
//    // ADMIN: TAKE ACTION
//    // -------------------------
//    @Transactional
//    public ViolationReportDetailResponse takeAction(Long id, ViolationReportTakeActionRequest req) {
//
//        ViolationReport vr = vrRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
//
//        switch (req.getAction()) {
//
//            case "DELETE_COMMENT":
//                if (vr.getComment() == null)
//                    throw new InvalidRequestException("Report has no comment");
//                vr.getComment().setDeletedAt(Instant.now());
//                break;
//
//            case "BAN_USER":
//                if (vr.getTarget() == null)
//                    throw new InvalidRequestException("Report has no target user");
//                vr.getTarget().setStatus(AccountStatus.SUSPENDED);
//                break;
//
//            case "HIDE_COURSE":
//                if (vr.getCourse() == null)
//                    throw new InvalidRequestException("Missing course");
//                vr.getCourse().setIsClosed(true);
//                break;
//
//            case "HIDE_LESSON":
//                if (vr.getLesson() == null)
//                    throw new InvalidRequestException("Missing lesson");
//                vr.getLesson().setDeletedAt(Instant.now());
//                break;
//
//            default:
//                throw new InvalidRequestException("Invalid action: " + req.getAction());
//        }
//
//        vr.setStatus(ViolationReportStatus.ACTION_TAKEN);
//        vr.setAdminNote(req.getNote());
//
//        return ViolationReportMapper.toDetail(vrRepo.save(vr));
//    }

}
