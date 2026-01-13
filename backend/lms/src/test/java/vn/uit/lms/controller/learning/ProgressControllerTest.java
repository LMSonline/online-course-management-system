package vn.uit.lms.controller.learning;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import vn.uit.lms.service.learning.ProgressService;
import vn.uit.lms.shared.constant.ProgressStatus;
import vn.uit.lms.shared.dto.request.progress.UpdateWatchedDurationRequest;
import vn.uit.lms.shared.dto.response.progress.*;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for ProgressController
 * Covers UC-15 (Theo dõi tiến độ bài giảng)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProgressController Tests - Learning Progress Tracking")
class ProgressControllerTest {

    @Mock
    private ProgressService progressService;

    @InjectMocks
    private ProgressController progressController;

    private StudentProgressOverviewResponse studentProgressOverview;
    private CourseProgressResponse courseProgressResponse;
    private LessonProgressResponse lessonProgressResponse;
    private UpdateWatchedDurationRequest updateWatchedDurationRequest;

    @BeforeEach
    void setUp() {
        // Setup student overall progress
        CourseProgressSummary course1 = CourseProgressSummary.builder()
                .courseId(100L)
                .courseTitle("Introduction to Java")
                .completionPercentage(75.0f)
                .averageScore(85.5f)
                .totalLessons(20)
                .completedLessons(15)
                .build();

        CourseProgressSummary course2 = CourseProgressSummary.builder()
                .courseId(200L)
                .courseTitle("Advanced Spring Boot")
                .completionPercentage(30.0f)
                .averageScore(80.0f)
                .totalLessons(30)
                .completedLessons(9)
                .build();

        studentProgressOverview = StudentProgressOverviewResponse.builder()
                .studentId(1L)
                .studentName("John Doe")
                .totalEnrolledCourses(2)
                .completedCourses(0)
                .inProgressCourses(2)
                .overallCompletionPercentage(52.5f)
                .totalWatchedHours(15.5f)
                .averageScore(82.75f)
                .courses(Arrays.asList(course1, course2))
                .build();

        // Setup course progress
        LessonProgressResponse lesson1 = LessonProgressResponse.builder()
                .lessonId(1L)
                .lessonTitle("Introduction to Java")
                .status(ProgressStatus.COMPLETED)
                .watchedDurationSeconds(600)
                .build();

        LessonProgressResponse lesson2 = LessonProgressResponse.builder()
                .lessonId(2L)
                .lessonTitle("Variables and Data Types")
                .status(ProgressStatus.VIEWED)
                .watchedDurationSeconds(300)
                .build();

        ChapterProgressResponse chapter1 = ChapterProgressResponse.builder()
                .chapterId(1L)
                .chapterTitle("Getting Started")
                .completionPercentage(65.0f)
                .totalLessons(2)
                .completedLessons(1)
                .build();

        courseProgressResponse = CourseProgressResponse.builder()
                .courseId(100L)
                .courseTitle("Introduction to Java")
                .completionPercentage(65.0f)
                .totalLessons(2)
                .completedLessons(1)
                .totalDurationSeconds(1500)
                .watchedDurationSeconds(900)
                .build();

        // Setup lesson progress
        lessonProgressResponse = LessonProgressResponse.builder()
                .lessonId(1L)
                .lessonTitle("Introduction to Java")
                .status(ProgressStatus.NOT_VIEWED)
                .watchedDurationSeconds(0)
                .build();

        // Setup update watched duration request
        updateWatchedDurationRequest = new UpdateWatchedDurationRequest();
        updateWatchedDurationRequest.setDurationSeconds(300);
    }

    // ==================== UC-15: THEO DÕI TIẾN ĐỘ BÀI GIẢNG ====================

    @Nested
    @DisplayName("UC-15: Progress Tracking Tests")
    class ProgressTrackingTests {

        @Test
        @DisplayName("UC-15.1: Mở bài giảng -> Hệ thống tích xanh 'đã xem'")
        void testMarkLessonAsViewed_Success() {
            // Arrange
            Long lessonId = 1L;
            LessonProgressResponse viewedLesson = LessonProgressResponse.builder()
                    .lessonId(lessonId)
                    .lessonTitle("Introduction to Java")
                    .status(ProgressStatus.VIEWED)
                    .watchedDurationSeconds(0)
                    .build();

            when(progressService.markLessonAsViewed(eq(lessonId)))
                    .thenReturn(viewedLesson);

            // Act
            ResponseEntity<LessonProgressResponse> response =
                    progressController.markLessonAsViewed(lessonId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(ProgressStatus.VIEWED, response.getBody().getStatus());
            assertEquals(lessonId, response.getBody().getLessonId());

            verify(progressService, times(1)).markLessonAsViewed(eq(lessonId));
        }

        @Test
        @DisplayName("UC-15.2: Hoàn thành bài giảng -> Thanh % tiến độ tăng lên")
        void testMarkLessonAsCompleted_ProgressIncreases() {
            // Arrange
            Long lessonId = 1L;
            LessonProgressResponse completedLesson = LessonProgressResponse.builder()
                    .lessonId(lessonId)
                    .lessonTitle("Introduction to Java")
                    .status(ProgressStatus.COMPLETED)
                    .watchedDurationSeconds(600)
                    .completedAt(Instant.now())
                    .build();

            when(progressService.markLessonAsCompleted(eq(lessonId)))
                    .thenReturn(completedLesson);

            // Act
            ResponseEntity<LessonProgressResponse> response =
                    progressController.markLessonAsCompleted(lessonId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(ProgressStatus.COMPLETED, response.getBody().getStatus());
            assertNotNull(response.getBody().getCompletedAt());

            verify(progressService, times(1)).markLessonAsCompleted(eq(lessonId));
        }

        @Test
        @DisplayName("UC-15.3: Thoát bài giảng video khi chưa xem hết -> Không tích hoàn thành")
        void testExitVideoBeforeCompletion_NotMarkedComplete() {
            // Arrange
            Long lessonId = 2L;
            LessonProgressResponse inProgressLesson = LessonProgressResponse.builder()
                    .lessonId(lessonId)
                    .lessonTitle("Variables and Data Types")
                    .status(ProgressStatus.VIEWED)
                    .watchedDurationSeconds(300) // Only watched 5 minutes
                    .build();

            when(progressService.updateWatchedDuration(eq(lessonId), anyInt()))
                    .thenReturn(inProgressLesson);

            // Act
            ResponseEntity<LessonProgressResponse> response =
                    progressController.updateWatchedDuration(lessonId, updateWatchedDurationRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(ProgressStatus.VIEWED, response.getBody().getStatus());
            assertNull(response.getBody().getCompletedAt()); // Not completed yet

            verify(progressService, times(1)).updateWatchedDuration(eq(lessonId), anyInt());
        }

        @Test
        @DisplayName("UC-15.4: Kiểm tra thanh % tiến độ tổng thể của khóa học")
        void testGetStudentCourseProgress_VerifyOverallPercentage() {
            // Arrange
            Long studentId = 1L;
            Long courseId = 100L;

            when(progressService.getStudentCourseProgress(eq(studentId), eq(courseId)))
                    .thenReturn(courseProgressResponse);

            // Act
            ResponseEntity<CourseProgressResponse> response =
                    progressController.getStudentCourseProgress(studentId, courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(65.0f, response.getBody().getCompletionPercentage());
            assertEquals(1, response.getBody().getCompletedLessons());
            assertEquals(2, response.getBody().getTotalLessons());

            verify(progressService, times(1)).getStudentCourseProgress(eq(studentId), eq(courseId));
        }
    }

    // ==================== STUDENT OVERALL PROGRESS ====================

    @Nested
    @DisplayName("Student Overall Progress Tests")
    class StudentOverallProgressTests {

        @Test
        @DisplayName("Get student overall progress - Success")
        void testGetStudentProgress_Success() {
            // Arrange
            Long studentId = 1L;
            when(progressService.getStudentProgress(eq(studentId)))
                    .thenReturn(studentProgressOverview);

            // Act
            ResponseEntity<StudentProgressOverviewResponse> response =
                    progressController.getStudentProgress(studentId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(studentId, response.getBody().getStudentId());
            assertEquals("John Doe", response.getBody().getStudentName());
            assertEquals(2, response.getBody().getTotalEnrolledCourses());
            assertEquals(0, response.getBody().getCompletedCourses());
            assertEquals(2, response.getBody().getInProgressCourses());
            assertEquals(52.5f, response.getBody().getOverallCompletionPercentage());
            assertEquals(15.5f, response.getBody().getTotalWatchedHours());
            assertEquals(82.75f, response.getBody().getAverageScore());

            verify(progressService, times(1)).getStudentProgress(eq(studentId));
        }

        @Test
        @DisplayName("Get student progress - Student not found")
        void testGetStudentProgress_StudentNotFound() {
            // Arrange
            Long nonExistentStudentId = 999L;
            when(progressService.getStudentProgress(eq(nonExistentStudentId)))
                    .thenThrow(new ResourceNotFoundException("Student not found with id: 999"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> progressController.getStudentProgress(nonExistentStudentId)
            );

            assertTrue(exception.getMessage().contains("Student not found"));
            verify(progressService, times(1)).getStudentProgress(eq(nonExistentStudentId));
        }
    }

    // ==================== COURSE PROGRESS ====================

    @Nested
    @DisplayName("Course Progress Tests")
    class CourseProgressTests {

        @Test
        @DisplayName("Get student course progress - Success with chapters and lessons")
        void testGetStudentCourseProgress_Success() {
            // Arrange
            Long studentId = 1L;
            Long courseId = 100L;
            when(progressService.getStudentCourseProgress(eq(studentId), eq(courseId)))
                    .thenReturn(courseProgressResponse);

            // Act
            ResponseEntity<CourseProgressResponse> response =
                    progressController.getStudentCourseProgress(studentId, courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(courseId, response.getBody().getCourseId());
            assertEquals("Introduction to Java", response.getBody().getCourseTitle());
            assertEquals(65.0f, response.getBody().getCompletionPercentage());

            verify(progressService, times(1)).getStudentCourseProgress(eq(studentId), eq(courseId));
        }

        @Test
        @DisplayName("Get course progress - Student not enrolled")
        void testGetStudentCourseProgress_NotEnrolled() {
            // Arrange
            Long studentId = 1L;
            Long courseId = 999L;
            when(progressService.getStudentCourseProgress(eq(studentId), eq(courseId)))
                    .thenThrow(new InvalidRequestException("Student is not enrolled in this course"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> progressController.getStudentCourseProgress(studentId, courseId)
            );

            assertEquals("Student is not enrolled in this course", exception.getMessage());
            verify(progressService, times(1)).getStudentCourseProgress(eq(studentId), eq(courseId));
        }
    }

    // ==================== LESSON PROGRESS ====================

    @Nested
    @DisplayName("Lesson Progress Tests")
    class LessonProgressTests {

        @Test
        @DisplayName("Get lesson progress - Success")
        void testGetStudentLessonProgress_Success() {
            // Arrange
            Long studentId = 1L;
            Long lessonId = 1L;
            when(progressService.getStudentLessonProgress(eq(studentId), eq(lessonId)))
                    .thenReturn(lessonProgressResponse);

            // Act
            ResponseEntity<LessonProgressResponse> response =
                    progressController.getStudentLessonProgress(studentId, lessonId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(lessonId, response.getBody().getLessonId());
            assertEquals("Introduction to Java", response.getBody().getLessonTitle());

            verify(progressService, times(1)).getStudentLessonProgress(eq(studentId), eq(lessonId));
        }

        @Test
        @DisplayName("Mark lesson as completed - Success")
        void testMarkLessonAsCompleted_Success() {
            // Arrange
            Long lessonId = 1L;
            LessonProgressResponse completedLesson = LessonProgressResponse.builder()
                    .lessonId(lessonId)
                    .status(ProgressStatus.COMPLETED)
                    .completedAt(Instant.now())
                    .build();

            when(progressService.markLessonAsCompleted(eq(lessonId)))
                    .thenReturn(completedLesson);

            // Act
            ResponseEntity<LessonProgressResponse> response =
                    progressController.markLessonAsCompleted(lessonId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(ProgressStatus.COMPLETED, response.getBody().getStatus());

            verify(progressService, times(1)).markLessonAsCompleted(eq(lessonId));
        }

        @Test
        @DisplayName("Update watched duration - Success")
        void testUpdateWatchedDuration_Success() {
            // Arrange
            Long lessonId = 1L;
            LessonProgressResponse updatedProgress = LessonProgressResponse.builder()
                    .lessonId(lessonId)
                    .status(ProgressStatus.VIEWED)
                    .watchedDurationSeconds(300)
                    .build();

            when(progressService.updateWatchedDuration(eq(lessonId), anyInt()))
                    .thenReturn(updatedProgress);

            // Act
            ResponseEntity<LessonProgressResponse> response =
                    progressController.updateWatchedDuration(lessonId, updateWatchedDurationRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(300, response.getBody().getWatchedDurationSeconds());

            verify(progressService, times(1)).updateWatchedDuration(eq(lessonId), anyInt());
        }

        @Test
        @DisplayName("Update watched duration - Invalid duration")
        void testUpdateWatchedDuration_InvalidDuration() {
            // Arrange
            Long lessonId = 1L;
            UpdateWatchedDurationRequest invalidRequest = new UpdateWatchedDurationRequest();
            invalidRequest.setDurationSeconds(-100); // Negative duration

            when(progressService.updateWatchedDuration(eq(lessonId), anyInt()))
                    .thenThrow(new InvalidRequestException("Watched duration cannot be negative"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> progressController.updateWatchedDuration(lessonId, invalidRequest)
            );

            assertTrue(exception.getMessage().contains("cannot be negative"));
            verify(progressService, times(1)).updateWatchedDuration(eq(lessonId), anyInt());
        }
    }

    // ==================== PROGRESS STATISTICS ====================

    @Nested
    @DisplayName("Progress Statistics Tests")
    class ProgressStatisticsTests {

        @Test
        @DisplayName("Get progress statistics for course - Success")
        void testGetCourseProgressStats_Success() {
            // Arrange
            Long courseId = 100L;
            CourseProgressStatsResponse stats = CourseProgressStatsResponse.builder()
                    .courseId(courseId)
                    .averageCompletionPercentage(65.5f)
                    .build();

            when(progressService.getCourseProgressStats(eq(courseId)))
                    .thenReturn(stats);

            // Act
            ResponseEntity<CourseProgressStatsResponse> response =
                    progressController.getCourseProgressStats(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(65.5f, response.getBody().getAverageCompletionPercentage());

            verify(progressService, times(1)).getCourseProgressStats(eq(courseId));
        }
    }
}

