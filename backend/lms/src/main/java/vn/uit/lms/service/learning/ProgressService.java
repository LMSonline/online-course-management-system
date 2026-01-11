package vn.uit.lms.service.learning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.domain.learning.Progress;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.core.repository.learning.ProgressRepository;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.ProgressStatus;
import vn.uit.lms.shared.dto.response.progress.*;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.ProgressMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final StudentRepository studentRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressMapper progressMapper;
    private final EnrollmentAccessService enrollmentAccessService;

    /**
     * Get student overall progress
     *
     * Access Control:
     * - STUDENT: Can only view their own progress
     * - TEACHER: Can view progress of students enrolled in their courses
     * - ADMIN: Can view any student's progress
     *
     * Business Logic:
     * - Aggregates progress across all enrolled courses
     * - Calculates completion rates and watched hours
     * - Provides summary statistics for student dashboard
     */
    public StudentProgressOverviewResponse getStudentProgress(Long studentId) {
        log.info("Fetching overall progress for student: {}", studentId);

        // STEP 1: Access Control - Verify permission using EnrollmentAccessService
        enrollmentAccessService.verifyStudentAccessOrOwnership(studentId);

        // STEP 2: Verify student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // STEP 3: Get all enrollments for student
        List<Enrollment> enrollments = enrollmentRepository.findAllByStudentIdAndCourseId(studentId, null);

        // STEP 4: Get all progress records for student
        List<Progress> allProgress = progressRepository.findByStudentId(studentId);

        // STEP 5: Calculate statistics
        int totalEnrolled = enrollments.size();
        long completed = enrollments.stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.COMPLETED)
                .count();
        int inProgress = (int) (totalEnrolled - completed);

        // Calculate overall completion percentage
        float overallCompletion = totalEnrolled > 0
                ? enrollments.stream()
                    .map(Enrollment::getCompletionPercentage)
                    .filter(Objects::nonNull)
                    .reduce(0f, Float::sum) / totalEnrolled
                : 0f;

        // Calculate total watched hours
        int totalWatchedSeconds = allProgress.stream()
                .map(Progress::getWatchedDurationSeconds)
                .filter(Objects::nonNull)
                .reduce(0, Integer::sum);
        float totalWatchedHours = totalWatchedSeconds / 3600.0f;

        // Calculate average score across all courses
        double avgScore = enrollments.stream()
                .map(Enrollment::getAverageScore)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .average()
                .orElse(0.0);

        // STEP 6: Build course summaries
        List<CourseProgressSummary> courseSummaries = enrollments.stream()
                .map(enrollment -> buildCourseProgressSummary(studentId, enrollment))
                .collect(Collectors.toList());

        log.debug("Student {} progress: {} courses, {}% completion, {} hours watched",
                studentId, totalEnrolled, String.format("%.1f", overallCompletion),
                String.format("%.1f", totalWatchedHours));

        return StudentProgressOverviewResponse.builder()
                .studentId(studentId)
                .studentName(student.getFullName())
                .totalEnrolledCourses(totalEnrolled)
                .completedCourses((int) completed)
                .inProgressCourses(inProgress)
                .overallCompletionPercentage(overallCompletion)
                .totalWatchedHours(totalWatchedHours)
                .averageScore((float) avgScore)
                .courses(courseSummaries)
                .build();
    }

    /**
     * Build course progress summary for a single enrollment
     * Helper method to keep code clean and reusable
     */
    private CourseProgressSummary buildCourseProgressSummary(Long studentId, Enrollment enrollment) {
        Long courseId = enrollment.getCourse().getId();
        Long completedLessons = progressRepository.countCompletedLessonsByStudentAndCourse(studentId, courseId);

        // Calculate total lessons from course version
        int totalLessons = calculateTotalLessons(enrollment.getCourseVersion());

        return CourseProgressSummary.builder()
                .courseId(courseId)
                .courseTitle(enrollment.getCourse().getTitle())
                .completionPercentage(enrollment.getCompletionPercentage())
                .averageScore(enrollment.getAverageScore())
                .totalLessons(totalLessons)
                .completedLessons(completedLessons.intValue())
                .build();
    }

    /**
     * Calculate total lessons in a course version
     * Counts all lessons across all chapters
     */
    private int calculateTotalLessons(CourseVersion courseVersion) {
        if (courseVersion == null || courseVersion.getChapters() == null) {
            return 0;
        }

        return courseVersion.getChapters().stream()
                .filter(chapter -> chapter.getLessons() != null)
                .mapToInt(chapter -> chapter.getLessons().size())
                .sum();
    }

    /**
     * Get student progress in a specific course
     *
     * Access Control: Verifies student is enrolled in the course.
     *
     * Business Logic:
     * - Shows detailed progress for each chapter and lesson
     * - Calculates completion percentages at course, chapter, and lesson levels
     * - Tracks video watch time vs total duration
     * - Identifies lessons not yet started (NOT_VIEWED status)
     *
     * Use Case:
     * - Student viewing their course progress dashboard
     * - Teacher monitoring individual student progress
     */
    public CourseProgressResponse getStudentCourseProgress(Long studentId, Long courseId) {
        log.info("Fetching course progress for student {} in course {}", studentId, courseId);

        // STEP 1: Access Control - Verify enrollment and active status
        Enrollment enrollment = enrollmentAccessService.verifyStudentEnrollment(studentId, courseId);

        // STEP 2: Extract course information from validated enrollment
        Course course = enrollment.getCourse();
        CourseVersion courseVersion = enrollment.getCourseVersion();

        if (courseVersion == null || courseVersion.getChapters() == null) {
            log.warn("Course {} has no version or chapters", courseId);
            throw new InvalidRequestException("Course content is not available");
        }

        // STEP 3: Build progress map for quick lookup
        List<Progress> progressList = progressRepository.findByStudentIdAndCourseId(studentId, courseId);
        Map<Long, Progress> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        // STEP 4: Calculate course-level statistics
        List<ChapterProgressResponse> chapterProgressList = new ArrayList<>();
        int totalLessons = 0;
        int completedLessons = 0;
        int totalDuration = 0;
        int watchedDuration = 0;

        // STEP 5: Process each chapter and its lessons
        for (Chapter chapter : courseVersion.getChapters()) {
            if (chapter.getLessons() == null || chapter.getLessons().isEmpty()) {
                log.debug("Chapter {} has no lessons, skipping", chapter.getId());
                continue;
            }

            List<LessonProgressResponse> lessonProgressList = new ArrayList<>();
            int chapterCompleted = 0;

            // Process each lesson in the chapter
            for (Lesson lesson : chapter.getLessons()) {
                totalLessons++;

                // Accumulate total video duration
                if (lesson.getDurationSeconds() != null) {
                    totalDuration += lesson.getDurationSeconds();
                }

                Progress progress = progressMap.get(lesson.getId());
                if (progress != null) {
                    // Lesson has been viewed at least once
                    if (progress.isCompleted()) {
                        completedLessons++;
                        chapterCompleted++;
                    }

                    // Accumulate watched duration
                    if (progress.getWatchedDurationSeconds() != null) {
                        watchedDuration += progress.getWatchedDurationSeconds();
                    }

                    lessonProgressList.add(progressMapper.toLessonProgressResponse(progress));
                } else {
                    // Lesson not yet started - create placeholder progress
                    lessonProgressList.add(createNotViewedLessonProgress(lesson));
                }
            }

            // Calculate chapter completion percentage
            float chapterCompletion = (chapterCompleted * 100.0f) / chapter.getLessons().size();

            chapterProgressList.add(ChapterProgressResponse.builder()
                    .chapterId(chapter.getId())
                    .chapterTitle(chapter.getTitle())
                    .totalLessons(chapter.getLessons().size())
                    .completedLessons(chapterCompleted)
                    .completionPercentage(chapterCompletion)
                    .lessonProgress(lessonProgressList)
                    .build());
        }

        // STEP 6: Calculate final course completion percentage
        float completionPercentage = totalLessons > 0
                ? (completedLessons * 100.0f) / totalLessons
                : 0f;

        // STEP 7: Validate calculated completion matches enrollment
        if (enrollment.getCompletionPercentage() != null &&
            Math.abs(completionPercentage - enrollment.getCompletionPercentage()) > 1.0f) {
            log.warn("Calculated completion ({}) differs from enrollment completion ({}) for enrollment {}",
                    completionPercentage, enrollment.getCompletionPercentage(), enrollment.getId());
            // Use enrollment's completion as it's the source of truth
            completionPercentage = enrollment.getCompletionPercentage();
        }

        log.debug("Course progress for student {}: {}/{} lessons completed ({}%)",
                studentId, completedLessons, totalLessons, String.format("%.1f", completionPercentage));

        return CourseProgressResponse.builder()
                .courseId(courseId)
                .courseTitle(course.getTitle())
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .viewedLessons(progressList.size())
                .completionPercentage(completionPercentage)
                .totalDurationSeconds(totalDuration)
                .watchedDurationSeconds(watchedDuration)
                .averageScore(enrollment.getAverageScore())
                .chapterProgress(chapterProgressList)
                .build();
    }

    /**
     * Create a NOT_VIEWED lesson progress response for lessons not yet started
     * Helper method to maintain consistent response structure
     */
    private LessonProgressResponse createNotViewedLessonProgress(Lesson lesson) {
        return LessonProgressResponse.builder()
                .lessonId(lesson.getId())
                .lessonTitle(lesson.getTitle())
                .lessonType(lesson.getType().name())
                .lessonDurationSeconds(lesson.getDurationSeconds())
                .status(ProgressStatus.NOT_VIEWED)
                .timesViewed(0)
                .watchedDurationSeconds(0)
                .isBookmarked(false)
                .build();
    }

    /**
     * Get lesson progress for a student
     *
     * Access Control: Verifies student is enrolled in the course containing this lesson.
     */
    public LessonProgressResponse getStudentLessonProgress(Long studentId, Long lessonId) {
        log.info("Fetching lesson progress for student {} in lesson {}", studentId, lessonId);

        // STEP 1: Verify student is enrolled in the course containing this lesson
        Enrollment enrollment = enrollmentAccessService.verifyLessonAccess(studentId, lessonId);

        // STEP 2: Get lesson (already validated by access check)
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // Get course version from enrollment
        CourseVersion courseVersion = enrollment.getCourseVersion();

        // Find progress
        Progress progress = progressRepository.findByStudentIdAndLessonIdAndCourseVersionId(
                studentId, lessonId, courseVersion.getId()
        ).orElse(null);

        if (progress != null) {
            return progressMapper.toLessonProgressResponse(progress);
        }

        // No progress yet - return default
        return LessonProgressResponse.builder()
                .lessonId(lessonId)
                .lessonTitle(lesson.getTitle())
                .lessonType(lesson.getType().name())
                .lessonDurationSeconds(lesson.getDurationSeconds())
                .status(ProgressStatus.NOT_VIEWED)
                .timesViewed(0)
                .isBookmarked(false)
                .build();
    }

    /**
     * Mark lesson as viewed
     *
     * Business Logic:
     * - Creates or updates progress record with VIEWED status
     * - Increments view count (tracks how many times student watched)
     * - Records first view timestamp
     * - Updates enrollment progress percentage
     *
     * Preconditions:
     * - Student must be authenticated
     * - Student must be enrolled in the course
     * - Lesson must exist
     *
     * Postconditions:
     * - Progress record created/updated with VIEWED status
     * - Viewed timestamp recorded
     * - Times viewed incremented
     * - Enrollment completion percentage recalculated
     */
    @Transactional
    public LessonProgressResponse markLessonAsViewed(Long lessonId) {
        log.info("Marking lesson {} as viewed", lessonId);

        // STEP 1: Validate access and prepare context
        ProgressContext context = validateAndPrepareProgressContext(lessonId);

        // STEP 2: Find or create progress record
        Progress progress = findOrCreateProgress(context);

        // STEP 3: Mark as viewed using domain logic
        progress.markAsViewed();
        progress = progressRepository.save(progress);

        log.info("Lesson {} marked as viewed by student {} (view count: {})",
                lessonId, context.studentId, progress.getTimesViewed());

        // STEP 4: Update enrollment completion percentage
        updateEnrollmentProgress(context.enrollment);

        return progressMapper.toLessonProgressResponse(progress);
    }

    /**
     * Mark lesson as completed
     *
     * Business Logic:
     * - Marks lesson as COMPLETED (student finished the lesson)
     * - Records completion timestamp
     * - Recalculates enrollment completion percentage
     * - May trigger enrollment completion if all lessons done
     * - May trigger certificate issuance if eligible
     *
     * Preconditions:
     * - Student must be authenticated
     * - Student must be enrolled in the course
     * - Lesson must exist
     *
     * Postconditions:
     * - Progress status changed to COMPLETED
     * - Completion timestamp recorded
     * - Enrollment completion percentage updated
     * - Enrollment may be marked COMPLETED if all lessons done
     */
    @Transactional
    public LessonProgressResponse markLessonAsCompleted(Long lessonId) {
        log.info("Marking lesson {} as completed", lessonId);

        // STEP 1: Validate access and prepare context
        ProgressContext context = validateAndPrepareProgressContext(lessonId);

        // STEP 2: Find or create progress record
        Progress progress = findOrCreateProgress(context);

        // STEP 3: Mark as completed using domain logic
        progress.markAsCompleted();
        progress = progressRepository.save(progress);

        log.info("Lesson {} marked as completed by student {}", lessonId, context.studentId);

        // STEP 4: Update enrollment completion percentage
        // This may trigger enrollment completion if all lessons are done
        updateEnrollmentProgress(context.enrollment);

        return progressMapper.toLessonProgressResponse(progress);
    }

    /**
     * Update watched duration for video lessons
     *
     * Business Logic:
     * - Tracks video watch time (used for completion calculation)
     * - Auto-completes lesson if watched >= 90% of video duration
     * - Updates progress status (NOT_VIEWED → VIEWED → COMPLETED)
     * - Recalculates enrollment completion percentage
     *
     * Formula: completion = (watchedSeconds / lessonDuration) * 100
     * Auto-complete threshold: >= 90%
     *
     * Preconditions:
     * - Student must be authenticated
     * - Student must be enrolled in the course
     * - Lesson must exist
     * - Duration must be positive
     *
     * Postconditions:
     * - Watched duration updated
     * - Progress status updated (VIEWED or COMPLETED based on percentage)
     * - Auto-complete if watched >= 90% of video duration
     * - Enrollment completion percentage updated if lesson completed
     */
    @Transactional
    public LessonProgressResponse updateWatchedDuration(Long lessonId, Integer durationSeconds) {
        log.info("Updating watched duration for lesson {}: {} seconds", lessonId, durationSeconds);

        // Precondition: Validate duration
        if (durationSeconds == null || durationSeconds < 0) {
            throw new InvalidRequestException("Duration must be a positive number");
        }

        // STEP 1: Validate access and prepare context
        ProgressContext context = validateAndPrepareProgressContext(lessonId);

        // STEP 2: Find or create progress record
        Progress progress = findOrCreateProgress(context);

        // STEP 3: Update watched duration using domain logic
        // Domain entity will automatically:
        // - Mark as VIEWED if first time watching
        // - Mark as COMPLETED if watched >= 90%
        // - Calculate watch percentage
        boolean wasCompleted = progress.isCompleted();
        progress.updateWatchedDuration(durationSeconds);
        progress = progressRepository.save(progress);

        // Calculate watch percentage for logging
        float watchPercentage = 0f;
        if (progress.getLesson().getDurationSeconds() != null && progress.getLesson().getDurationSeconds() > 0) {
            watchPercentage = (progress.getWatchedDurationSeconds() * 100.0f) / progress.getLesson().getDurationSeconds();
        }

        log.info("Updated watched duration for lesson {}: {} seconds. Status: {}, Watch %: {}%",
                lessonId, durationSeconds, progress.getStatus(), String.format("%.1f", watchPercentage));

        // STEP 4: Update enrollment progress if lesson was newly completed
        if (!wasCompleted && progress.isCompleted()) {
            log.info("Lesson {} auto-completed by watch threshold", lessonId);
            updateEnrollmentProgress(context.enrollment);
        }

        return progressMapper.toLessonProgressResponse(progress);
    }

    /**
     * Get course progress statistics (Teacher access)
     *
     * Business Logic:
     * - Provides overview of student progress across the course
     * - Calculates average completion and scores
     * - Identifies struggling students (low completion rate)
     * - Shows most/least completed lessons (pending implementation)
     *
     * Access Control: Verifies teacher owns the course.
     *
     * Use Case:
     * - Teacher dashboard showing course analytics
     * - Identifying lessons that need improvement
     * - Monitoring student engagement
     */
    public CourseProgressStatsResponse getCourseProgressStats(Long courseId) {
        log.info("Fetching progress stats for course: {}", courseId);

        // STEP 1: Access Control - Verify teacher owns the course
        Course course = enrollmentAccessService.verifyTeacherCourseOwnership(courseId);

        // STEP 2: Get enrollment statistics
        Long totalEnrolled = enrollmentRepository.countByCourseId(courseId);
        Long studentsWithProgress = progressRepository.countStudentsWithProgressInCourse(courseId);
        Long studentsCompleted = enrollmentRepository.countByCourseIdAndStatus(
                courseId, EnrollmentStatus.COMPLETED);

        // STEP 3: Calculate average metrics
        Double avgCompletion = enrollmentRepository.getAverageCompletionPercentageByCourseId(courseId);
        Double avgScore = enrollmentRepository.getAverageScoreByCourseId(courseId);

        // STEP 4: Get lesson statistics (pending full implementation)
        // TODO: Add lesson-level completion statistics
        // Implementation plan:
        // 1. Query progress grouped by lesson
        // 2. Calculate completion rate per lesson
        // 3. Sort by completion rate
        // 4. Return top 5 most completed and bottom 5 least completed
        // This helps teachers identify:
        // - Most engaging lessons (high completion)
        // - Difficult lessons (low completion - may need improvement)

        log.debug("Course {} stats: {}/{} students with progress, {} completed, avg completion: {}%",
                courseId, studentsWithProgress, totalEnrolled, studentsCompleted,
                String.format("%.1f", avgCompletion != null ? avgCompletion : 0.0));

        return CourseProgressStatsResponse.builder()
                .courseId(courseId)
                .courseTitle(course.getTitle())
                .totalEnrolledStudents(totalEnrolled.intValue())
                .studentsWithProgress(studentsWithProgress.intValue())
                .studentsCompleted(studentsCompleted.intValue())
                .averageCompletionPercentage(avgCompletion != null ? avgCompletion.floatValue() : 0f)
                .averageScore(avgScore != null ? avgScore.floatValue() : 0f)
                .build();
    }

    /**
     * Helper method to update enrollment progress percentage
     *
     * Business Logic:
     * - Counts completed lessons in the course
     * - Calculates completion percentage: (completed / total) * 100
     * - Updates enrollment entity with new percentage
     * - May trigger enrollment completion if all lessons done
     * - May trigger certificate issuance if eligible
     *
     * Triggers:
     * - Called after any lesson completion
     * - Called after video watch time update (if lesson completed)
     *
     * Important: This method synchronizes progress data with enrollment
     */
    private void updateEnrollmentProgress(Enrollment enrollment) {
        Long studentId = enrollment.getStudent().getId();
        Long courseId = enrollment.getCourse().getId();

        // Count completed lessons
        Long completedCount = progressRepository.countCompletedLessonsByStudentAndCourse(studentId, courseId);

        // Calculate total lessons from course version
        CourseVersion courseVersion = enrollment.getCourseVersion();
        if (courseVersion == null || courseVersion.getChapters() == null) {
            log.warn("Cannot update progress for enrollment {} - no course version", enrollment.getId());
            return;
        }

        int totalLessons = courseVersion.getChapters().stream()
                .filter(chapter -> chapter.getLessons() != null)
                .mapToInt(chapter -> chapter.getLessons().size())
                .sum();

        if (totalLessons > 0) {
            // Calculate new completion percentage
            float percentage = (completedCount * 100.0f) / totalLessons;

            // Update enrollment using domain logic
            enrollment.updateProgress(percentage);
            enrollmentRepository.save(enrollment);

            log.debug("Updated enrollment {} progress: {}/{} lessons ({}%)",
                    enrollment.getId(), completedCount, totalLessons, String.format("%.1f", percentage));

            // Check if enrollment should be marked as completed
            if (percentage >= 100.0f && enrollment.getStatus() != EnrollmentStatus.COMPLETED) {
                log.info("Enrollment {} reached 100% completion, consider marking as COMPLETED",
                        enrollment.getId());
                // Note: Actual enrollment completion requires quiz scores
                // This is just progress tracking
            }
        }
    }

    /**
     * Helper: Validate and prepare all necessary context for progress tracking
     *
     * Uses EnrollmentAccessService to verify student enrollment.
     */
    private ProgressContext validateAndPrepareProgressContext(Long lessonId) {
        // STEP 1: Verify current student is enrolled in the course containing this lesson
        Enrollment enrollment = enrollmentAccessService.verifyCurrentStudentLessonAccess(lessonId);

        // STEP 2: Get entities (already validated by access check)
        Student student = enrollment.getStudent();
        Course course = enrollment.getCourse();
        CourseVersion courseVersion = enrollment.getCourseVersion();

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        return new ProgressContext(student, lesson, course, courseVersion, enrollment);
    }

    /**
     * Helper: Find existing progress or create new one
     */
    private Progress findOrCreateProgress(ProgressContext context) {
        return progressRepository.findByStudentIdAndLessonIdAndCourseVersionId(
                context.studentId, context.lesson.getId(), context.courseVersion.getId()
        ).orElseGet(() -> Progress.builder()
                .student(context.student)
                .lesson(context.lesson)
                .course(context.course)
                .courseVersion(context.courseVersion)
                .build());
    }

    /**
     * Inner class to hold progress context and avoid parameter passing
     */
    private static class ProgressContext {
        final Student student;
        final Long studentId;
        final Lesson lesson;
        final Course course;
        final CourseVersion courseVersion;
        final Enrollment enrollment;

        ProgressContext(Student student, Lesson lesson, Course course,
                       CourseVersion courseVersion, Enrollment enrollment) {
            this.student = student;
            this.studentId = student.getId();
            this.lesson = lesson;
            this.course = course;
            this.courseVersion = courseVersion;
            this.enrollment = enrollment;
        }
    }
}

