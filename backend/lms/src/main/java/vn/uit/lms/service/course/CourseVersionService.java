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
     * Validates content requirements before submission:
     * - At least 1 chapter with lessons
     * - All lessons have content (video or text)
     * - Price is set correctly
     * - Thumbnail exists
     * - Passing criteria configured
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

        // ✅ Validate content requirements before submission
        validateContentRequirements(version, course);

        version.setStatus(CourseStatus.PENDING);

        courseVersionRepository.save(version);

        eventPublisher.publishEvent(new CourseVersionStatusChangeEvent(version, ""));
        return CourseVersionMapper.toCourseVersionResponse(version);
    }

    /**
     * Validate content requirements before submission
     */
    private void validateContentRequirements(CourseVersion version, Course course) {
        // Check minimum chapters
        if (version.getChapters() == null || version.getChapters().isEmpty()) {
            throw new InvalidRequestException("Course must have at least 1 chapter before submission");
        }

        // Check minimum lessons
        long totalLessons = version.getChapters().stream()
                .filter(chapter -> chapter.getLessons() != null)
                .mapToLong(chapter -> chapter.getLessons().size())
                .sum();

        if (totalLessons == 0) {
            throw new InvalidRequestException("Course must have at least 1 lesson before submission");
        }

        // Check all lessons have content (video or description)
        boolean hasInvalidLesson = version.getChapters().stream()
                .filter(chapter -> chapter.getLessons() != null)
                .flatMap(chapter -> chapter.getLessons().stream())
                .anyMatch(lesson -> {
                    // Video lesson must have video
                    if (lesson.isVideoLesson()) {
                        return lesson.getVideoObjectKey() == null || lesson.getVideoObjectKey().isBlank();
                    }
                    // Text lesson must have description
                    return lesson.getShortDescription() == null || lesson.getShortDescription().isBlank();
                });

        if (hasInvalidLesson) {
            throw new InvalidRequestException("All lessons must have content (video for VIDEO type, description for others)");
        }

        // Check price is set
        if (version.getPrice() == null) {
            throw new InvalidRequestException("Price must be set (use 0 for free courses)");
        }

        if (version.getPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new InvalidRequestException("Price cannot be negative");
        }

        // Check thumbnail exists
        if (course.getThumbnailUrl() == null || course.getThumbnailUrl().isBlank()) {
            throw new InvalidRequestException("Course must have a thumbnail before submission");
        }

        // Check passing score configured
        if (version.getPassScore() == null || version.getPassScore() <= 0) {
            throw new InvalidRequestException("Passing score must be configured (e.g., 8.0)");
        }

        // Check duration is set
        if (version.getDurationDays() <= 0) {
            throw new InvalidRequestException("Course duration must be set (days)");
        }

        // Validate final weight
        if (version.getFinalWeight() == null || version.getFinalWeight() < 0 || version.getFinalWeight() > 1) {
            throw new InvalidRequestException("Final exam weight must be between 0 and 1 (e.g., 0.6 for 60%)");
        }

        // TODO: Future enhancements
        // - Check all videos are processed (not in PENDING state)
        // - Validate minimum course duration
        // - Check for placeholder content
        // - Generate preview link for admin
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

    /**
     * Update course version
     * Only DRAFT or REJECTED versions can be updated
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseVersionResponse updateCourseVersion(Long courseId, Long versionId, CourseVersionRequest request) {
        // Validate course and teacher ownership (same pattern as other methods)
        Course course = courseService.validateCourse(courseId);
        courseService.verifyTeacher(course);

        // Get version and verify it belongs to course
        CourseVersion version = courseVersionRepository.findByIdAndDeletedAtIsNull(versionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course version not found or has been removed with id: " + versionId));

        // Verify version belongs to this course
        if (!version.getCourse().getId().equals(courseId)) {
            throw new InvalidRequestException("Version does not belong to the specified course");
        }

        // Check if version is editable (only DRAFT or REJECTED)
        if (version.getStatus() != CourseStatus.DRAFT && version.getStatus() != CourseStatus.REJECTED) {
            throw new InvalidRequestException(
                    "Only DRAFT or REJECTED versions can be updated. Current status: " + version.getStatus());
        }

        // Update fields (partial update - only provided fields)
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            version.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null) {
            version.setDescription(request.getDescription().trim());
        }

        // Update price with validation
        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
                throw new InvalidRequestException("Price cannot be negative");
            }
            version.setPrice(request.getPrice());
        }

        // Update duration with validation
        if (request.getDurationDays() != null) {
            if (request.getDurationDays() < 0) {
                throw new InvalidRequestException("Duration cannot be negative");
            }
            version.setDurationDays(request.getDurationDays());
        }

        // Update passing score with validation
        if (request.getPassScore() != null) {
            if (request.getPassScore() < 0.0f || request.getPassScore() > 10.0f) {
                throw new InvalidRequestException("Pass score must be between 0 and 10");
            }
            version.setPassScore(request.getPassScore());
        }

        // Update final weight with validation
        if (request.getFinalWeight() != null) {
            if (request.getFinalWeight() < 0.0f || request.getFinalWeight() > 1.0f) {
                throw new InvalidRequestException("Final weight must be between 0 and 1");
            }
            version.setFinalWeight(request.getFinalWeight());
        }

        // Update min progress percentage with validation
        if (request.getMinProgressPct() != null) {
            if (request.getMinProgressPct() < 0 || request.getMinProgressPct() > 100) {
                throw new InvalidRequestException("Minimum progress percentage must be between 0 and 100");
            }
            version.setMinProgressPct(request.getMinProgressPct());
        }

        if (request.getNotes() != null) {
            version.setNotes(request.getNotes().trim());
        }

        // If status was REJECTED, reset to DRAFT when updating
        if (version.getStatus() == CourseStatus.REJECTED) {
            version.setStatus(CourseStatus.DRAFT);
            version.setApprovedBy(null);
            version.setApprovedAt(null);
        }

        // Save updated version
        CourseVersion updatedVersion = courseVersionRepository.save(version);

        // Return response (use same mapper as other methods)
        return CourseVersionMapper.toCourseVersionResponse(updatedVersion);
    }

    /**
     * Duplicate course version
     *
     * Implementation Plan:
     * 1. Load source version with all relationships
     * 2. Create new version entity with incremented version number
     * 3. Deep copy all content:
     *    - Chapters: Copy chapter structure and order
     *    - Lessons: Copy lesson data, video references (NOT files)
     *    - Resources: Copy resource metadata and S3 keys
     * 4. Set new version to DRAFT status
     * 5. Clear approval/publish metadata
     * 6. Maintain video object keys (files stay in cloud storage)
     *
     * Use Case:
     * - Teacher wants to create new version based on existing one
     * - Updates content without affecting live students
     *
     * @param courseId Course ID
     * @param versionId Source version ID to duplicate
     * @return Created draft version
     */
    // @Transactional
    // @EnableSoftDeleteFilter
    // public CourseVersionResponse duplicateCourseVersion(Long courseId, Long versionId) {
    //     // Load source version with chapters and lessons
    //     CourseVersion sourceVersion = loadVersionWithContent(courseId, versionId);
    //     Course course = sourceVersion.getCourse();
    //
    //     // Create new version with incremented number
    //     Integer newVersionNumber = courseVersionRepository
    //         .findMaxVersionNumberByCourseId(courseId) + 1;
    //
    //     CourseVersion newVersion = CourseVersion.builder()
    //         .course(course)
    //         .versionNumber(newVersionNumber)
    //         .title(sourceVersion.getTitle() + " (Copy)")
    //         .shortDescription(sourceVersion.getShortDescription())
    //         .description(sourceVersion.getDescription())
    //         .price(sourceVersion.getPrice())
    //         .durationDays(sourceVersion.getDurationDays())
    //         .passScore(sourceVersion.getPassScore())
    //         .finalWeight(sourceVersion.getFinalWeight())
    //         .minProgressPct(sourceVersion.getMinProgressPct())
    //         .status(CourseStatus.DRAFT)
    //         .build();
    //
    //     newVersion = courseVersionRepository.save(newVersion);
    //
    //     // Deep copy chapters and lessons
    //     for (Chapter sourceChapter : sourceVersion.getChapters()) {
    //         Chapter newChapter = Chapter.builder()
    //             .courseVersion(newVersion)
    //             .title(sourceChapter.getTitle())
    //             .orderIndex(sourceChapter.getOrderIndex())
    //             .build();
    //         newChapter = chapterRepository.save(newChapter);
    //
    //         for (Lesson sourceLesson : sourceChapter.getLessons()) {
    //             Lesson newLesson = Lesson.builder()
    //                 .chapter(newChapter)
    //                 .type(sourceLesson.getType())
    //                 .title(sourceLesson.getTitle())
    //                 .shortDescription(sourceLesson.getShortDescription())
    //                 .videoObjectKey(sourceLesson.getVideoObjectKey()) // Reference, not copy
    //                 .durationSeconds(sourceLesson.getDurationSeconds())
    //                 .orderIndex(sourceLesson.getOrderIndex())
    //                 .isPreview(sourceLesson.getIsPreview())
    //                 .build();
    //             lessonRepository.save(newLesson);
    //         }
    //     }
    //
    //     return CourseVersionMapper.toCourseVersionResponse(newVersion);
    // }

    /**
     * Compare two versions of a course
     *
     * Implementation Plan:
     * 1. Load both versions with full content
     * 2. Compare metadata (title, description, price, etc.)
     * 3. Compare chapter structure:
     *    - Added chapters
     *    - Removed chapters
     *    - Modified chapters
     * 4. Compare lessons:
     *    - Added/removed/modified lessons
     *    - Video changes
     *    - Order changes
     * 5. Return structured diff
     *
     * Use Case:
     * - Admin reviewing version changes before approval
     * - Teacher reviewing what changed between versions
     *
     * @param courseId Course ID
     * @param version1Id First version ID (older)
     * @param version2Id Second version ID (newer)
     * @return Comparison details
     */
    // public VersionComparisonResponse compareVersions(Long courseId, Long version1Id, Long version2Id) {
    //     CourseVersion v1 = loadVersionWithContent(courseId, version1Id);
    //     CourseVersion v2 = loadVersionWithContent(courseId, version2Id);
    //
    //     List<String> metadataChanges = new ArrayList<>();
    //     if (!Objects.equals(v1.getTitle(), v2.getTitle())) {
    //         metadataChanges.add("Title changed");
    //     }
    //     if (!Objects.equals(v1.getPrice(), v2.getPrice())) {
    //         metadataChanges.add(String.format("Price changed from %s to %s",
    //             v1.getPrice(), v2.getPrice()));
    //     }
    //
    //     // Compare chapters and lessons
    //     List<ChapterDiff> chapterDiffs = compareChapters(v1.getChapters(), v2.getChapters());
    //
    //     return VersionComparisonResponse.builder()
    //         .version1Id(version1Id)
    //         .version2Id(version2Id)
    //         .metadataChanges(metadataChanges)
    //         .chapterDiffs(chapterDiffs)
    //         .build();
    // }

    /**
     * Get analytics for a course version
     *
     * Implementation Plan:
     * 1. Count content elements:
     *    - Total chapters
     *    - Total lessons by type (VIDEO, QUIZ, TEXT, etc.)
     *    - Total resources
     * 2. Calculate durations:
     *    - Total video duration (sum of all video lessons)
     *    - Estimated completion time (videos + reading + quizzes)
     * 3. Content completeness:
     *    - Percentage of lessons with descriptions
     *    - Percentage of video lessons with videos uploaded
     *    - Lessons missing content
     * 4. Calculate course metrics:
     *    - Average chapter size (lessons per chapter)
     *    - Content distribution (video vs quiz vs text)
     *
     * Use Case:
     * - Teacher reviewing content completeness before publishing
     * - Admin validating course quality
     *
     * @param courseId Course ID
     * @param versionId Version ID
     * @return Analytics data
     */
    // public VersionAnalyticsResponse getVersionAnalytics(Long courseId, Long versionId) {
    //     CourseVersion version = loadVersionWithContent(courseId, versionId);
    //
    //     int totalChapters = version.getChapters().size();
    //     int totalLessons = version.getChapters().stream()
    //         .mapToInt(c -> c.getLessons().size())
    //         .sum();
    //
    //     Map<LessonType, Long> lessonsByType = version.getChapters().stream()
    //         .flatMap(c -> c.getLessons().stream())
    //         .collect(Collectors.groupingBy(Lesson::getType, Collectors.counting()));
    //
    //     int totalVideoDuration = version.getChapters().stream()
    //         .flatMap(c -> c.getLessons().stream())
    //         .filter(l -> l.getType() == LessonType.VIDEO && l.getDurationSeconds() != null)
    //         .mapToInt(Lesson::getDurationSeconds)
    //         .sum();
    //
    //     long lessonsWithVideo = version.getChapters().stream()
    //         .flatMap(c -> c.getLessons().stream())
    //         .filter(l -> l.getType() == LessonType.VIDEO)
    //         .filter(l -> l.getVideoObjectKey() != null)
    //         .count();
    //
    //     long videoLessons = lessonsByType.getOrDefault(LessonType.VIDEO, 0L);
    //     float contentCompleteness = videoLessons > 0
    //         ? (float) lessonsWithVideo / videoLessons * 100
    //         : 100f;
    //
    //     return VersionAnalyticsResponse.builder()
    //         .versionId(versionId)
    //         .totalChapters(totalChapters)
    //         .totalLessons(totalLessons)
    //         .lessonsByType(lessonsByType)
    //         .totalVideoDurationSeconds(totalVideoDuration)
    //         .totalVideoDurationHours(totalVideoDuration / 3600f)
    //         .estimatedCompletionHours(totalVideoDuration / 3600f * 1.5f) // +50% for exercises
    //         .contentCompletenessPercentage(contentCompleteness)
    //         .build();
    // }

    /**
     * Archive course version manually
     *
     * Implementation Plan:
     * 1. Verify version exists and is not currently published
     * 2. Verify no active enrollments on this version
     * 3. Set status to ARCHIVED
     * 4. Keep all content for historical reference
     *
     * Use Case:
     * - Manually archive old draft versions
     * - Clean up unpublished versions
     *
     * @param courseId Course ID
     * @param versionId Version ID to archive
     * @return Archived version
     */
    // @Transactional
    // public CourseVersionResponse archiveCourseVersion(Long courseId, Long versionId) {
    //     CourseVersion version = loadVersion(courseId, versionId);
    //
    //     // Cannot archive current published version
    //     if (version.getCourse().getVersionPublish() != null &&
    //         version.getCourse().getVersionPublish().getId().equals(versionId)) {
    //         throw new InvalidRequestException("Cannot archive currently published version");
    //     }
    //
    //     // Check for active enrollments
    //     long activeEnrollments = enrollmentRepository
    //         .countByCourseVersionIdAndStatusIn(versionId,
    //             Arrays.asList(EnrollmentStatus.ENROLLED, EnrollmentStatus.COMPLETED));
    //
    //     if (activeEnrollments > 0) {
    //         throw new InvalidRequestException(
    //             String.format("Cannot archive version with %d active enrollments", activeEnrollments));
    //     }
    //
    //     version.setStatus(CourseStatus.ARCHIVED);
    //     version = courseVersionRepository.save(version);
    //
    //     return CourseVersionMapper.toCourseVersionResponse(version);
    // }
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
