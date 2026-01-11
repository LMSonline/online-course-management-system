package vn.uit.lms.service.learning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.assignment.Assignment;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assignment.AssignmentRepository;
import vn.uit.lms.core.repository.assessment.QuizRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.ChapterRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;

import java.time.Instant;
import java.util.Optional;

/**
 * Centralized service for enrollment access validation.
 * This service consolidates all enrollment-related access checks to avoid duplication.
 *
 * Responsibilities:
 * - Verify student enrollment in courses
 * - Validate enrollment status (active, not expired)
 * - Check access to course content (lessons, chapters, assignments, quizzes)
 * - Verify teacher ownership of courses
 *
 * Usage:
 * - Call verification methods BEFORE executing business logic
 * - Business services should assume access is already validated
 * - Throws UnauthorizedException or ResourceNotFoundException on access denial
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EnrollmentAccessService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ChapterRepository chapterRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final AccountService accountService;



    /**
     * Verify student is enrolled in a course with active status.
     *
     * @param studentId Student ID
     * @param courseId Course ID
     * @return Active enrollment
     * @throws UnauthorizedException if not enrolled or enrollment inactive
     */
    public Enrollment verifyStudentEnrollment(Long studentId, Long courseId) {
        log.debug("Verifying enrollment for student {} in course {}", studentId, courseId);

        Optional<Enrollment> enrollmentOpt = enrollmentRepository
                .findByStudentIdAndCourseId(studentId, courseId);

        if (enrollmentOpt.isEmpty()) {
            throw new UnauthorizedException("You are not enrolled in this course");
        }

        Enrollment enrollment = enrollmentOpt.get();

        // Check enrollment is active
        if (!enrollment.isActive()) {
            throw new UnauthorizedException("Your enrollment is not active. Status: " + enrollment.getStatus());
        }

        // Check not expired
        if (enrollment.getEndAt() != null && enrollment.getEndAt().isBefore(Instant.now())) {
            throw new UnauthorizedException("Your enrollment has expired");
        }

        log.debug("Enrollment verified: id={}, status={}", enrollment.getId(), enrollment.getStatus());
        return enrollment;
    }

    /**
     * Verify current authenticated student is enrolled in a course.
     *
     * @param courseId Course ID
     * @return Active enrollment
     */
    public Enrollment verifyCurrentStudentEnrollment(Long courseId) {
        Student student = getCurrentStudent();
        return verifyStudentEnrollment(student.getId(), courseId);
    }

    /**
     * Check if student is enrolled (returns boolean, doesn't throw)
     *
     * @param studentId Student ID
     * @param courseId Course ID
     * @return true if enrolled with active status
     */
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        try {
            verifyStudentEnrollment(studentId, courseId);
            return true;
        } catch (UnauthorizedException e) {
            return false;
        }
    }

    /* ==================== LESSON ACCESS VERIFICATION ==================== */

    /**
     * Verify student has access to a lesson.
     * Checks enrollment in the course containing the lesson.
     *
     * @param studentId Student ID
     * @param lessonId Lesson ID
     * @return Active enrollment
     */
    public Enrollment verifyLessonAccess(Long studentId, Long lessonId) {
        log.debug("Verifying lesson access for student {} to lesson {}", studentId, lessonId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Course course = getCourseFromLesson(lesson);
        return verifyStudentEnrollment(studentId, course.getId());
    }

    /**
     * Verify current student has access to a lesson.
     *
     * @param lessonId Lesson ID
     * @return Active enrollment
     */
    public Enrollment verifyCurrentStudentLessonAccess(Long lessonId) {
        Student student = getCurrentStudent();
        return verifyLessonAccess(student.getId(), lessonId);
    }

    /* ==================== CHAPTER ACCESS VERIFICATION ==================== */

    /**
     * Verify student has access to a chapter.
     * Checks enrollment in the course containing the chapter.
     *
     * @param studentId Student ID
     * @param chapterId Chapter ID
     * @return Active enrollment
     */
    public Enrollment verifyChapterAccess(Long studentId, Long chapterId) {
        log.debug("Verifying chapter access for student {} to chapter {}", studentId, chapterId);

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        Course course = getCourseFromChapter(chapter);
        return verifyStudentEnrollment(studentId, course.getId());
    }

    /**
     * Verify current student has access to a chapter.
     *
     * @param chapterId Chapter ID
     * @return Active enrollment
     */
    public Enrollment verifyCurrentStudentChapterAccess(Long chapterId) {
        Student student = getCurrentStudent();
        return verifyChapterAccess(student.getId(), chapterId);
    }

    /* ==================== ASSIGNMENT ACCESS VERIFICATION ==================== */

    /**
     * Verify student has access to an assignment.
     * Checks enrollment in the course containing the assignment's lesson.
     *
     * @param studentId Student ID
     * @param assignmentId Assignment ID
     * @return Active enrollment
     */
    public Enrollment verifyAssignmentAccess(Long studentId, Long assignmentId) {
        log.debug("Verifying assignment access for student {} to assignment {}", studentId, assignmentId);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Lesson lesson = assignment.getLesson();
        if (lesson == null) {
            throw new ResourceNotFoundException("Assignment is not associated with a lesson");
        }

        Course course = getCourseFromLesson(lesson);
        return verifyStudentEnrollment(studentId, course.getId());
    }

    /**
     * Verify current student has access to an assignment.
     *
     * @param assignmentId Assignment ID
     * @return Active enrollment
     */
    public Enrollment verifyCurrentStudentAssignmentAccess(Long assignmentId) {
        Student student = getCurrentStudent();
        return verifyAssignmentAccess(student.getId(), assignmentId);
    }

    /* ==================== QUIZ ACCESS VERIFICATION ==================== */

    /**
     * Verify student has access to a quiz.
     * Checks enrollment in the course containing the quiz's lesson.
     *
     * @param studentId Student ID
     * @param quizId Quiz ID
     * @return Active enrollment
     */
    public Enrollment verifyQuizAccess(Long studentId, Long quizId) {
        log.debug("Verifying quiz access for student {} to quiz {}", studentId, quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        Lesson lesson = quiz.getLesson();
        if (lesson == null) {
            throw new ResourceNotFoundException("Quiz is not associated with a lesson");
        }

        Course course = getCourseFromLesson(lesson);
        return verifyStudentEnrollment(studentId, course.getId());
    }

    /**
     * Verify current student has access to a quiz.
     *
     * @param quizId Quiz ID
     * @return Active enrollment
     */
    public Enrollment verifyCurrentStudentQuizAccess(Long quizId) {
        Student student = getCurrentStudent();
        return verifyQuizAccess(student.getId(), quizId);
    }

    /* ==================== TEACHER OWNERSHIP VERIFICATION ==================== */

    /**
     * Verify current teacher owns a course.
     *
     * @param courseId Course ID
     * @return Course entity
     * @throws UnauthorizedException if not the owner
     */
    public Course verifyTeacherCourseOwnership(Long courseId) {
        Account account = accountService.verifyCurrentAccount();

        if (!account.getRole().equals(Role.TEACHER)) {
            throw new UnauthorizedException("Only teachers can access this resource");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Teacher courseOwner = course.getTeacher();
        if (courseOwner == null || !courseOwner.getAccount().getId().equals(account.getId())) {
            throw new UnauthorizedException("You do not own this course");
        }

        return course;
    }

    /**
     * Verify current teacher owns the lesson (through its course).
     *
     * @param lessonId Lesson ID
     * @return Lesson entity
     */
    public Lesson verifyTeacherLessonOwnership(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Course course = getCourseFromLesson(lesson);
        verifyTeacherCourseOwnership(course.getId());

        return lesson;
    }

    /**
     * Verify current teacher owns the assignment (through its course).
     *
     * @param assignmentId Assignment ID
     * @return Assignment entity
     */
    public Assignment verifyTeacherAssignmentOwnership(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Lesson lesson = assignment.getLesson();
        Course course = getCourseFromLesson(lesson);
        verifyTeacherCourseOwnership(course.getId());

        return assignment;
    }

    /**
     * Verify current teacher owns the quiz (through its course).
     *
     * @param quizId Quiz ID
     * @return Quiz entity
     */
    public Quiz verifyTeacherQuizOwnership(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        Lesson lesson = quiz.getLesson();
        Course course = getCourseFromLesson(lesson);
        verifyTeacherCourseOwnership(course.getId());

        return quiz;
    }

    /* ==================== HELPER METHODS ==================== */

    /**
     * Get current authenticated student.
     */
    private Student getCurrentStudent() {
        Account account = accountService.validateCurrentAccountByRole(Role.STUDENT);
        return studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    /**
     * Get course from lesson (navigating through chapter and course version).
     */
    private Course getCourseFromLesson(Lesson lesson) {
        Chapter chapter = lesson.getChapter();
        if (chapter == null) {
            throw new ResourceNotFoundException("Lesson is not associated with a chapter");
        }

        return getCourseFromChapter(chapter);
    }

    /**
     * Get course from chapter (navigating through course version).
     */
    private Course getCourseFromChapter(Chapter chapter) {
        if (chapter.getCourseVersion() == null) {
            throw new ResourceNotFoundException("Chapter is not associated with a course version");
        }

        Course course = chapter.getCourseVersion().getCourse();
        if (course == null) {
            throw new ResourceNotFoundException("Course not found for chapter");
        }

        return course;
    }

    /**
     * Load enrollment by ID with validation.
     */
    public Enrollment loadEnrollment(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
    }

    /**
     * Verify current user can access enrollment details.
     * Students can only see their own enrollments.
     * Teachers can see enrollments in their courses.
     *
     * @param enrollmentId Enrollment ID
     * @return Enrollment entity
     */
    public Enrollment verifyEnrollmentAccess(Long enrollmentId) {
        Enrollment enrollment = loadEnrollment(enrollmentId);
        Account account = accountService.verifyCurrentAccount();

        if (account.getRole().equals(Role.STUDENT)) {
            Student student = studentRepository.findByAccount(account)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

            if (!enrollment.getStudent().getId().equals(student.getId())) {
                throw new UnauthorizedException("You can only access your own enrollments");
            }
        } else if (account.getRole().equals(Role.TEACHER)) {
            Course course = enrollment.getCourse();
            if (course == null || !course.getTeacher().getAccount().getId().equals(account.getId())) {
                throw new UnauthorizedException("You can only access enrollments in your courses");
            }
        }

        return enrollment;
    }

    /**
     * Verify current user can access student data (for ProgressService).
     *
     * Access Rules:
     * - STUDENT: Can only access their own data
     * - TEACHER: Can access students enrolled in their courses
     * - ADMIN: Can access any student data
     *
     * @param studentId Student ID to access
     * @throws UnauthorizedException if access denied
     */
    public void verifyStudentAccessOrOwnership(Long studentId) {
        Account account = accountService.verifyCurrentAccount();
        Role role = account.getRole();

        // ADMIN can access any student
        if (role == Role.ADMIN) {
            return;
        }

        // STUDENT can only access their own data
        if (role == Role.STUDENT) {
            Student currentStudent = studentRepository.findByAccount(account)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

            if (!currentStudent.getId().equals(studentId)) {
                throw new UnauthorizedException("You can only access your own progress data");
            }
            return;
        }

        // TEACHER can access students enrolled in their courses
        // Future enhancement: Check if teacher owns any course the student is enrolled in
        if (role == Role.TEACHER) {
            log.debug("Teacher access to student progress - enrollment check pending");
            // When enrollment relationship checking is needed:
            // boolean hasEnrollment = enrollmentRepository
            //     .existsStudentInTeacherCourses(studentId, account.getId());
            // if (!hasEnrollment) {
            //     throw new UnauthorizedException("You can only access students enrolled in your courses");
            // }
            return;
        }

        throw new UnauthorizedException("Access denied to student data");
    }
}

