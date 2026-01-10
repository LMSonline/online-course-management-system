package vn.uit.lms.service.learning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.domain.learning.Progress;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.core.repository.learning.ProgressRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.ProgressStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.response.progress.*;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.ProgressMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
     */
    public StudentProgressOverviewResponse getStudentProgress(Long studentId) {
        log.info("Fetching overall progress for student: {}", studentId);

        // Verify student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // TODO: Verify access (student can only view their own progress OR teacher/admin)
        // Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);

        // Get all enrollments for student
        List<Enrollment> enrollments = enrollmentRepository.findAllByStudentIdAndCourseId(studentId, null);

        // Get all progress for student
        List<Progress> allProgress = progressRepository.findByStudentId(studentId);

        // Calculate statistics
        int totalEnrolled = enrollments.size();
        long completed = enrollments.stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.COMPLETED)
                .count();
        int inProgress = (int) (totalEnrolled - completed);

        // Calculate overall completion
        float overallCompletion = enrollments.stream()
                .map(Enrollment::getCompletionPercentage)
                .filter(p -> p != null)
                .reduce(0f, Float::sum) / Math.max(1, totalEnrolled);

        // Calculate total watched hours
        int totalWatchedSeconds = allProgress.stream()
                .map(Progress::getWatchedDurationSeconds)
                .filter(d -> d != null)
                .reduce(0, Integer::sum);
        float totalWatchedHours = totalWatchedSeconds / 3600.0f;

        // Calculate average score
        Double avgScore = enrollments.stream()
                .map(Enrollment::getAverageScore)
                .filter(s -> s != null)
                .collect(Collectors.averagingDouble(Float::doubleValue));

        // Build course summaries
        List<CourseProgressSummary> courseSummaries = enrollments.stream()
                .map(enrollment -> {
                    Long courseId = enrollment.getCourse().getId();
                    Long completedLessons = progressRepository.countCompletedLessonsByStudentAndCourse(studentId, courseId);
                    // TODO: Get total lessons from course version
                    Integer totalLessons = 0; // Calculate from course version

                    return CourseProgressSummary.builder()
                            .courseId(courseId)
                            .courseTitle(enrollment.getCourse().getTitle())
                            .completionPercentage(enrollment.getCompletionPercentage())
                            .averageScore(enrollment.getAverageScore())
                            .totalLessons(totalLessons)
                            .completedLessons(completedLessons.intValue())
                            .build();
                })
                .collect(Collectors.toList());

        return StudentProgressOverviewResponse.builder()
                .studentId(studentId)
                .studentName(student.getFullName())
                .totalEnrolledCourses(totalEnrolled)
                .completedCourses((int) completed)
                .inProgressCourses(inProgress)
                .overallCompletionPercentage(overallCompletion)
                .totalWatchedHours(totalWatchedHours)
                .averageScore(avgScore != null ? avgScore.floatValue() : 0f)
                .courses(courseSummaries)
                .build();
    }

    /**
     * Get student progress in a specific course
     *
     * Access Control: Verifies student is enrolled in the course.
     */
    public CourseProgressResponse getStudentCourseProgress(Long studentId, Long courseId) {
        log.info("Fetching course progress for student {} in course {}", studentId, courseId);

        // STEP 1: Verify enrollment using centralized service
        Enrollment enrollment = enrollmentAccessService.verifyStudentEnrollment(studentId, courseId);

        // STEP 2: Get student and course (already validated by enrollment check)
        Student student = enrollment.getStudent();
        Course course = enrollment.getCourse();
        CourseVersion courseVersion = enrollment.getCourseVersion();

        // Get all progress for this course
        List<Progress> progressList = progressRepository.findByStudentIdAndCourseId(studentId, courseId);
        Map<Long, Progress> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        // Build chapter progress
        List<ChapterProgressResponse> chapterProgressList = new ArrayList<>();
        int totalLessons = 0;
        int completedLessons = 0;
        int totalDuration = 0;
        int watchedDuration = 0;

        for (Chapter chapter : courseVersion.getChapters()) {
            List<LessonProgressResponse> lessonProgressList = new ArrayList<>();
            int chapterCompleted = 0;

            for (Lesson lesson : chapter.getLessons()) {
                totalLessons++;
                if (lesson.getDurationSeconds() != null) {
                    totalDuration += lesson.getDurationSeconds();
                }

                Progress progress = progressMap.get(lesson.getId());
                if (progress != null) {
                    if (progress.isCompleted()) {
                        completedLessons++;
                        chapterCompleted++;
                    }
                    if (progress.getWatchedDurationSeconds() != null) {
                        watchedDuration += progress.getWatchedDurationSeconds();
                    }
                    lessonProgressList.add(progressMapper.toLessonProgressResponse(progress));
                } else {
                    // No progress yet
                    lessonProgressList.add(LessonProgressResponse.builder()
                            .lessonId(lesson.getId())
                            .lessonTitle(lesson.getTitle())
                            .lessonType(lesson.getType().name())
                            .lessonDurationSeconds(lesson.getDurationSeconds())
                            .status(ProgressStatus.NOT_VIEWED)
                            .timesViewed(0)
                            .isBookmarked(false)
                            .build());
                }
            }

            float chapterCompletion = chapter.getLessons().isEmpty() ? 0
                    : (chapterCompleted * 100.0f) / chapter.getLessons().size();

            chapterProgressList.add(ChapterProgressResponse.builder()
                    .chapterId(chapter.getId())
                    .chapterTitle(chapter.getTitle())
                    .totalLessons(chapter.getLessons().size())
                    .completedLessons(chapterCompleted)
                    .completionPercentage(chapterCompletion)
                    .lessonProgress(lessonProgressList)
                    .build());
        }

        float completionPercentage = totalLessons == 0 ? 0
                : (completedLessons * 100.0f) / totalLessons;

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
     * Preconditions:
     * - Student must be authenticated
     * - Student must be enrolled in the course
     * - Lesson must exist
     *
     * Postconditions:
     * - Progress record created/updated with VIEWED status
     * - Viewed timestamp recorded
     * - Times viewed incremented
     */
    @Transactional
    public LessonProgressResponse markLessonAsViewed(Long lessonId) {
        log.info("Marking lesson {} as viewed", lessonId);

        ProgressContext context = validateAndPrepareProgressContext(lessonId);
        Progress progress = findOrCreateProgress(context);

        progress.markAsViewed();
        progress = progressRepository.save(progress);

        log.info("Lesson {} marked as viewed by student {}", lessonId, context.studentId);
        updateEnrollmentProgress(context.enrollment);

        return progressMapper.toLessonProgressResponse(progress);
    }

    /**
     * Mark lesson as completed
     * Preconditions:
     * - Student must be authenticated
     * - Student must be enrolled in the course
     * - Lesson must exist
     *
     * Postconditions:
     * - Progress status changed to COMPLETED
     * - Completion timestamp recorded
     * - Enrollment completion percentage updated
     */
    @Transactional
    public LessonProgressResponse markLessonAsCompleted(Long lessonId) {
        log.info("Marking lesson {} as completed", lessonId);

        ProgressContext context = validateAndPrepareProgressContext(lessonId);
        Progress progress = findOrCreateProgress(context);

        progress.markAsCompleted();
        progress = progressRepository.save(progress);

        log.info("Lesson {} marked as completed by student {}", lessonId, context.studentId);
        updateEnrollmentProgress(context.enrollment);

        return progressMapper.toLessonProgressResponse(progress);
    }

    /**
     * Update watched duration for video lessons
     * Preconditions:
     * - Student must be authenticated
     * - Student must be enrolled in the course
     * - Lesson must exist and be a video lesson
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
        if (durationSeconds < 0) {
            throw new InvalidRequestException("Duration must be positive");
        }

        ProgressContext context = validateAndPrepareProgressContext(lessonId);
        Progress progress = findOrCreateProgress(context);

        // Update watched duration using domain logic
        // This will automatically mark as VIEWED or COMPLETED based on percentage
        progress.updateWatchedDuration(durationSeconds);
        progress = progressRepository.save(progress);

        log.info("Updated watched duration for lesson {}: {} seconds. Status: {}",
                lessonId, durationSeconds, progress.getStatus());

        // Update enrollment progress if lesson was completed
        if (progress.isCompleted()) {
            updateEnrollmentProgress(context.enrollment);
        }

        return progressMapper.toLessonProgressResponse(progress);
    }

    /**
     * Get course progress statistics (Teacher access)
     *
     * Access Control: Verifies teacher owns the course.
     */
    public CourseProgressStatsResponse getCourseProgressStats(Long courseId) {
        log.info("Fetching progress stats for course: {}", courseId);

        // STEP 1: Verify teacher owns the course
        Course course = enrollmentAccessService.verifyTeacherCourseOwnership(courseId);

        // STEP 2: Get enrollment stats (access verified)
        Long totalEnrolled = enrollmentRepository.countByCourseId(courseId);
        Long studentsWithProgress = progressRepository.countStudentsWithProgressInCourse(courseId);
        Long studentsCompleted = enrollmentRepository.countByCourseIdAndStatus(
                courseId, vn.uit.lms.shared.constant.EnrollmentStatus.COMPLETED);

        // Get average completion
        Double avgCompletion = enrollmentRepository.getAverageCompletionPercentageByCourseId(courseId);

        // Get average score
        Double avgScore = enrollmentRepository.getAverageScoreByCourseId(courseId);

        // TODO: Get most/least completed lessons
        // List<Object[]> lessonStats = progressRepository.findLessonCompletionStats(courseId);

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
     */
    private void updateEnrollmentProgress(Enrollment enrollment) {
        Long studentId = enrollment.getStudent().getId();
        Long courseId = enrollment.getCourse().getId();

        Long completedCount = progressRepository.countCompletedLessonsByStudentAndCourse(studentId, courseId);
        CourseVersion courseVersion = enrollment.getCourseVersion();
        int totalLessons = courseVersion.getChapters().stream()
                .mapToInt(chapter -> chapter.getLessons().size())
                .sum();

        if (totalLessons > 0) {
            float percentage = (completedCount * 100.0f) / totalLessons;
            enrollment.updateProgress(percentage);
            enrollmentRepository.save(enrollment);
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

