package vn.uit.lms.service.course;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.event.CourseVersionStatusChangeEvent;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.course.CourseVersionRequest;
import vn.uit.lms.shared.dto.response.course.CourseVersionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CourseVersionMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.time.Instant;
import java.util.List;

@Service
public class CourseVersionService {

    private final CourseVersionRepository courseVersionRepository;
    private final CourseService courseService;
    private final AccountService accountService;
    private final ApplicationEventPublisher eventPublisher;

    public CourseVersionService(CourseVersionRepository courseVersionRepository,
            CourseService courseService,
            AccountService accountService,
            ApplicationEventPublisher eventPublisher) {
        this.courseVersionRepository = courseVersionRepository;
        this.courseService = courseService;
        this.accountService = accountService;
        this.eventPublisher = eventPublisher;
    }

    public CourseVersion validateVersionEditable(Long versionId) {
        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));

        if (!version.isDraft() && !version.isRejected()) {
            throw new InvalidRequestException("Only draft or rejected versions can be modified.");
        }

        return version;
    }

    @Transactional
    public CourseVersionResponse createCourseVersion(Long courseId, CourseVersionRequest request) {

        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion newVersion = new CourseVersion();
        newVersion.setCourse(course);

        int nextVersionNumber = 1;
        if (!course.getVersions().isEmpty()) {
            CourseVersion lastVersion = course.getLastVersion();
            nextVersionNumber = lastVersion.getVersionNumber() + 1;

            newVersion.setPrice(lastVersion.getPrice());
            newVersion.setDurationDays(lastVersion.getDurationDays());
            newVersion.setPassScore(lastVersion.getPassScore());
            newVersion.setFinalWeight(lastVersion.getFinalWeight());
            newVersion.setMinProgressPct(lastVersion.getMinProgressPct());
            newVersion.setNotes(lastVersion.getNotes());
        }
        newVersion.setVersionNumber(nextVersionNumber);

        newVersion.setTitle(request.getTitle());
        newVersion.setDescription(request.getDescription());
        newVersion.setPrice(request.getPrice() != null ? request.getPrice() : newVersion.getPrice());
        newVersion.setDurationDays(
                request.getDurationDays() != null ? request.getDurationDays() : newVersion.getDurationDays());
        newVersion.setPassScore(request.getPassScore() != null ? request.getPassScore() : newVersion.getPassScore());
        newVersion.setFinalWeight(
                request.getFinalWeight() != null ? request.getFinalWeight() : newVersion.getFinalWeight());
        newVersion.setNotes(request.getNotes() != null ? request.getNotes() : newVersion.getNotes());
        newVersion.setStatus(CourseStatus.DRAFT);

        CourseVersion savedVersion = courseVersionRepository.save(newVersion);

        return CourseVersionMapper.toCourseVersionResponse(savedVersion);
    }

    @EnableSoftDeleteFilter
    public List<CourseVersionResponse> getCourseVersions(Long courseId) {
        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndDeletedAtIsNull(course);

        return versions.stream().map(CourseVersionMapper::toCourseVersionResponse).toList();
    }

    public List<CourseVersionResponse> getDeletedCourseVersions(Long courseId) {
        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndDeletedAtIsNotNull(course);

        return versions.stream().map(CourseVersionMapper::toCourseVersionResponse).toList();
    }

    @EnableSoftDeleteFilter
    public CourseVersionResponse getCourseVersionById(Long courseId, Long versionId) {

        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course version not found or has remove with id: " + versionId));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    /**
     * Submit course version for approval
     *
     * TODO: Add comprehensive validation before submission
     * - Validate version has minimum required content:
     * - At least 1 chapter with lessons
     * - All lessons have content (video or text)
     * - Price is set (if not free course)
     * - Duration and passing criteria are configured
     * - Validate all videos are processed and ready
     * - Check all required fields are filled
     * - Validate course has thumbnail
     * - Ensure learning objectives are defined
     * - Check for placeholder content
     * - Validate total course duration meets minimum
     * - Generate preview link for admin review
     * - Send notification to admin queue
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse submitCourseVersionToApprove(Long courseId, Long versionId) {
        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course version not found or has remove with id: " + versionId));

        if (version.getStatus() != CourseStatus.DRAFT) {
            throw new InvalidRequestException("Course version is not DRAFT");
        }

        // TODO: Add validation checks
        // if (version.getChapters().isEmpty()) {
        // throw new InvalidRequestException("Course must have at least one chapter");
        // }
        //
        // long totalLessons = version.getChapters().stream()
        // .mapToLong(Chapter::getLessons().size())
        // .sum();
        // if (totalLessons < 3) {
        // throw new InvalidRequestException("Course must have at least 3 lessons");
        // }
        //
        // boolean hasUnprocessedVideos = checkForUnprocessedVideos(version);
        // if (hasUnprocessedVideos) {
        // throw new InvalidRequestException("All videos must be processed before
        // submission");
        // }
        //
        // if (version.getPrice() == null || version.getPrice() < 0) {
        // throw new InvalidRequestException("Course price must be set");
        // }
        version.setStatus(CourseStatus.PENDING);

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse approveCourseVersion(Long courseId, Long versionId) {

        Course course = courseService.validateCourse(courseId);

        Account account = accountService.validateCurrentAccountByRole(Role.ADMIN);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course version not found or has remove with id: " + versionId));

        if (version.getStatus() != CourseStatus.PENDING && version.getStatus() != CourseStatus.REJECTED) {
            throw new InvalidRequestException("Course status invalid");
        }

        version.setStatus(CourseStatus.APPROVED);
        version.setApprovedBy(account.getEmail());
        version.setApprovedAt(Instant.now());

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));

        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse rejectCourseVersion(Long courseId, Long versionId, RejectRequest rejectRequest) {

        Course course = courseService.validateCourse(courseId);

        accountService.validateCurrentAccountByRole(Role.ADMIN);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course version not found or has remove with id: " + versionId));

        if (version.getStatus() != CourseStatus.PENDING) {
            throw new InvalidRequestException("Course version is not PENDING");
        }

        version.setStatus(CourseStatus.REJECTED);

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, rejectRequest.getReason()));

        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    /**
     * Publish course version
     *
     * NOTE: This method only sets the status to PUBLISHED and publishes the
     * version.
     * The Course entity's getVersionPublish() method will automatically return the
     * latest published version.
     * Previous published versions remain in PUBLISHED status for historical record.
     * To archive old versions, use the archiveCourseVersion() method explicitly.
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse publishCourseVersion(Long courseId, Long versionId) {

        Course course = courseService.validateCourse(courseId);

        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course version not found or has remove with id: " + versionId));

        if (version.getStatus() != CourseStatus.APPROVED) {
            throw new InvalidRequestException("Course version is not APPROVED");
        }

        version.setStatus(CourseStatus.PUBLISHED);
        version.setPublishedAt(Instant.now());

        // Save the newly published version
        courseVersionRepository.save(version);

        // Publish event for notification
        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));

        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    @EnableSoftDeleteFilter
    public PageResponse<CourseVersionResponse> getAllPendingCourseVersion(Specification<CourseVersion> spec,
            Pageable pageable) {
        Specification<CourseVersion> pendingSpec = (root, query, cb) -> cb.equal(root.get("status"),
                CourseStatus.PENDING);

        // merge specification
        if (spec == null) {
            spec = pendingSpec;
        } else {
            spec = spec.and(pendingSpec);
        }

        // query
        Page<CourseVersion> page = courseVersionRepository.findAll(spec, pageable);

        // map items
        List<CourseVersionResponse> items = page.getContent()
                .stream()
                .map(CourseVersionMapper::toCourseVersionResponse)
                .toList();

        // return page response
        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious());
    }

    /**
     * Delete course version (soft delete)
     * Only DRAFT, PENDING, or REJECTED versions can be deleted
     */
    @Transactional
    @EnableSoftDeleteFilter
    public void deleteCourseVersion(Long courseId, Long versionId) {
        Course course = courseService.validateCourse(courseId);
        courseService.verifyTeacher(course);

        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found with id: " + versionId));

        // Validate version status - cannot delete APPROVED or PUBLISHED versions
        if (version.getStatus() == CourseStatus.APPROVED || version.getStatus() == CourseStatus.PUBLISHED) {
            throw new InvalidRequestException("Cannot delete APPROVED or PUBLISHED versions");
        }

        // Validate version belongs to the course
        if (!version.getCourse().getId().equals(courseId)) {
            throw new InvalidRequestException("Version does not belong to this course");
        }

        // Check if it's the only version (must keep at least one)
        long activeVersionsCount = courseVersionRepository.countByCourseAndDeletedAtIsNull(course);
        if (activeVersionsCount <= 1) {
            throw new InvalidRequestException("Cannot delete the only version of the course");
        }

        // Soft delete the version
        version.setDeletedAt(Instant.now());
        courseVersionRepository.save(version);
    }

    /**
     * Get course versions filtered by status
     */
    @EnableSoftDeleteFilter
    public List<CourseVersionResponse> getCourseVersionsByStatus(Long courseId, String statusStr) {
        Course course = courseService.validateCourse(courseId);
        courseService.verifyTeacher(course);

        // Parse and validate status
        CourseStatus status;
        try {
            status = CourseStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException("Invalid status: " + statusStr);
        }

        List<CourseVersion> versions = courseVersionRepository.findAllByCourseAndStatusAndDeletedAtIsNull(course,
                status);
        return versions.stream()
                .map(CourseVersionMapper::toCourseVersionResponse)
                .toList();
    }

    // TODO: Implement updateCourseVersion method
    // @Transactional
    // @EnableSoftDeleteFilter
    // public CourseVersionResponse updateCourseVersion(Long courseId, Long
    // versionId, CourseVersionRequest request) {
    // - Validate version is editable (DRAFT or REJECTED)
    // - Verify teacher ownership
    // - Update title, description, price, duration, passing criteria
    // - Validate business rules (price >= 0, duration > 0, etc.)
    // - Log changes for audit
    // }

    // TODO: Implement duplicateCourseVersion method
    // @Transactional
    // @EnableSoftDeleteFilter
    // public CourseVersionResponse duplicateCourseVersion(Long courseId, Long
    // versionId) {
    // - Copy all version data to new version
    // - Deep copy chapters, lessons, resources
    // - Copy video references (not files themselves)
    // - Set status to DRAFT
    // - Increment version number
    // - Clear approval/publish dates
    // }

    // TODO: Implement compareVersions method
    // public VersionComparisonResponse compareVersions(Long courseId, Long
    // version1Id, Long version2Id) {
    // - Compare content differences between two versions
    // - Show added/removed/modified chapters and lessons
    // - Compare pricing and configuration changes
    // - Useful for admin review process
    // }

    // TODO: Implement getVersionAnalytics method
    // public VersionAnalyticsResponse getVersionAnalytics(Long courseId, Long
    // versionId) {
    // - Count total chapters, lessons, resources
    // - Calculate total video duration
    // - Count different lesson types
    // - Estimate completion time
    // - Show content completeness percentage
    // }

    // TODO: Implement archiveCourseVersion method
    // @Transactional
    // public CourseVersionResponse archiveCourseVersion(Long courseId, Long
    // versionId) {
    // - Manually archive old published version
    // - Verify not the current published version
    // - Update status to ARCHIVED
    // - Keep for historical reference
    // }

    // TODO: Implement restoreCourseVersion method
    // @Transactional
    // public CourseVersionResponse restoreCourseVersion(Long courseId, Long
    // versionId) {
    // - Restore soft-deleted version
    // - Validate version can be restored
    // - Check for conflicts with existing versions
    // - Restore as DRAFT status
    // }

    // TODO: Implement getVersionHistory method
    // public List<VersionHistoryResponse> getVersionHistory(Long courseId) {
    // - Get all versions with their status changes
    // - Include approval/rejection history
    // - Show who made changes and when
    // - Include version comparison links
    // }

}
