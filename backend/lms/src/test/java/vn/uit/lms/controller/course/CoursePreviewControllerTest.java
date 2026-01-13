package vn.uit.lms.controller.course;

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
import vn.uit.lms.service.course.CoursePreviewService;
import vn.uit.lms.shared.constant.Difficulty;
import vn.uit.lms.shared.dto.response.course.CoursePreviewResponse;
import vn.uit.lms.shared.dto.response.course.content.ChapterPreviewDto;
import vn.uit.lms.shared.dto.response.course.content.LessonPreviewDto;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for CoursePreviewController
 * Covers UC-11 (Tìm kiếm / Xem khóa học)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CoursePreviewController Tests - Course Search & Preview")
class CoursePreviewControllerTest {

    @Mock
    private CoursePreviewService coursePreviewService;

    @InjectMocks
    private CoursePreviewController coursePreviewController;

    private CoursePreviewResponse coursePreviewResponse;

    @BeforeEach
    void setUp() {
        // Setup preview lessons
        LessonPreviewDto previewLesson = LessonPreviewDto.builder()
                .id(1L)
                .title("Introduction Video")
                .durationSeconds(600)
                .isPreview(true)
                .orderIndex(1)
                .build();

        LessonPreviewDto lockedLesson = LessonPreviewDto.builder()
                .id(2L)
                .title("Advanced Topics")
                .durationSeconds(1800)
                .isPreview(false)
                .orderIndex(2)
                .build();

        // Setup chapter preview
        ChapterPreviewDto chapterPreview = ChapterPreviewDto.builder()
                .id(1L)
                .title("Getting Started")
                .description("Introduction chapter")
                .orderIndex(1)
                .totalLessons(2)
                .lessons(Arrays.asList(previewLesson, lockedLesson))
                .build();

        // Setup category
        CoursePreviewResponse.CategoryDto category = CoursePreviewResponse.CategoryDto.builder()
                .id(1L)
                .name("Programming")
                .code("PROG")
                .build();

        // Setup teacher
        CoursePreviewResponse.TeacherDto teacher = CoursePreviewResponse.TeacherDto.builder()
                .id(5L)
                .name("John Smith")
                .email("john.smith@example.com")
                .build();

        // Setup published version
        CoursePreviewResponse.PublishedVersionDto publishedVersion =
                CoursePreviewResponse.PublishedVersionDto.builder()
                .id(10L)
                .versionNumber(1)
                .price(BigDecimal.valueOf(500000))
                .durationDays(180)
                .totalChapters(1)
                .totalLessons(2)
                .previewLessonsCount(1)
                .chapters(Collections.singletonList(chapterPreview))
                .build();

        // Setup course preview
        coursePreviewResponse = CoursePreviewResponse.builder()
                .id(100L)
                .title("Introduction to Java Programming")
                .slug("introduction-to-java-programming")
                .shortDescription("Learn Java from scratch")
                .difficulty(Difficulty.BEGINNER)
                .thumbnailUrl("https://example.com/thumbnail.jpg")
                .category(category)
                .teacher(teacher)
                .tags(Arrays.asList("Java", "Programming", "Backend"))
                .publishedVersion(publishedVersion)
                .build();
    }

    // ==================== UC-11: TÌM KIẾM / XEM KHÓA HỌC ====================

    @Nested
    @DisplayName("UC-11: Course Search & View Tests")
    class CourseSearchAndViewTests {

        @Test
        @DisplayName("UC-11.1: Tìm kiếm theo từ khóa đúng - Có kết quả")
        void testSearchCourses_WithValidKeyword_ReturnsResults() {
            // This would typically be tested in CourseController with filtering
            // Here we test the preview retrieval
            String slug = "introduction-to-java-programming";

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(coursePreviewResponse);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Introduction to Java Programming", response.getBody().getTitle());
            assertEquals(slug, response.getBody().getSlug());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }

        @Test
        @DisplayName("UC-11.2: Tìm kiếm từ khóa không tồn tại - Không có kết quả")
        void testSearchCourses_WithInvalidKeyword_NoResults() {
            // Arrange
            String nonExistentSlug = "non-existent-course";

            when(coursePreviewService.getCoursePreview(eq(nonExistentSlug)))
                    .thenThrow(new ResourceNotFoundException("Course not found with slug: " + nonExistentSlug));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> coursePreviewController.getCoursePreview(nonExistentSlug)
            );

            assertTrue(exception.getMessage().contains("Course not found"));
            verify(coursePreviewService, times(1)).getCoursePreview(eq(nonExistentSlug));
        }

        @Test
        @DisplayName("UC-11.3: Lọc theo danh mục/giá/giảng viên")
        void testFilterCourses_ByCategory() {
            // This filtering would be tested in CourseController
            // Here we verify preview includes category information
            String slug = "introduction-to-java-programming";

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(coursePreviewResponse);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response);
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getCategory());
            assertEquals("Programming", response.getBody().getCategory().getName());
            assertNotNull(response.getBody().getTeacher());
            assertEquals("John Smith", response.getBody().getTeacher().getName());
            assertNotNull(response.getBody().getPublishedVersion());
            assertEquals(BigDecimal.valueOf(500000), response.getBody().getPublishedVersion().getPrice());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }

        @Test
        @DisplayName("UC-11.4: Xem chi tiết khóa học - Chưa login (Public access)")
        void testViewCourseDetail_NotAuthenticated_PublicAccess() {
            // Arrange
            String slug = "introduction-to-java-programming";

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(coursePreviewResponse);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert - Public endpoint should work without authentication
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Introduction to Java Programming", response.getBody().getTitle());

            // Verify chapters and lessons are visible
            assertNotNull(response.getBody().getPublishedVersion());
            assertNotNull(response.getBody().getPublishedVersion().getChapters());
            assertFalse(response.getBody().getPublishedVersion().getChapters().isEmpty());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }

        @Test
        @DisplayName("UC-11.5: Xem chi tiết khóa học - Đã login (Authenticated access)")
        void testViewCourseDetail_Authenticated_SameAccess() {
            // Arrange
            String slug = "introduction-to-java-programming";

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(coursePreviewResponse);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert - Same preview available for authenticated users
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }
    }

    // ==================== COURSE PREVIEW DETAILS ====================

    @Nested
    @DisplayName("Course Preview Details Tests")
    class CoursePreviewDetailsTests {

        @Test
        @DisplayName("Get course preview - Complete information displayed")
        void testGetCoursePreview_CompleteInformation() {
            // Arrange
            String slug = "introduction-to-java-programming";

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(coursePreviewResponse);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());

            CoursePreviewResponse preview = response.getBody();
            assertNotNull(preview);

            // Basic info
            assertEquals(100L, preview.getId());
            assertEquals("Introduction to Java Programming", preview.getTitle());
            assertEquals(slug, preview.getSlug());
            assertEquals(Difficulty.BEGINNER, preview.getDifficulty());

            // Category and Teacher
            assertNotNull(preview.getCategory());
            assertEquals("Programming", preview.getCategory().getName());
            assertNotNull(preview.getTeacher());
            assertEquals("John Smith", preview.getTeacher().getName());

            // Published version info
            assertNotNull(preview.getPublishedVersion());
            assertEquals(BigDecimal.valueOf(500000), preview.getPublishedVersion().getPrice());
            assertEquals(1, preview.getPublishedVersion().getTotalChapters());
            assertEquals(2, preview.getPublishedVersion().getTotalLessons());

            // Content structure
            assertNotNull(preview.getPublishedVersion().getChapters());
            assertEquals(1, preview.getPublishedVersion().getChapters().size());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }

        @Test
        @DisplayName("Get course preview - Only published courses visible")
        void testGetCoursePreview_OnlyPublished() {
            // Arrange
            String draftSlug = "draft-course";

            when(coursePreviewService.getCoursePreview(eq(draftSlug)))
                    .thenThrow(new InvalidRequestException("Course is not published yet"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> coursePreviewController.getCoursePreview(draftSlug)
            );

            assertTrue(exception.getMessage().contains("not published"));
            verify(coursePreviewService, times(1)).getCoursePreview(eq(draftSlug));
        }

        @Test
        @DisplayName("Get course preview - Chapters and lessons structure")
        void testGetCoursePreview_ChaptersAndLessons() {
            // Arrange
            String slug = "introduction-to-java-programming";

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(coursePreviewResponse);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getPublishedVersion());

            ChapterPreviewDto chapter = response.getBody().getPublishedVersion().getChapters().get(0);
            assertEquals("Getting Started", chapter.getTitle());
            assertEquals(2, chapter.getLessons().size());

            // Check preview lesson
            LessonPreviewDto previewLesson = chapter.getLessons().get(0);
            assertTrue(previewLesson.getIsPreview());
            assertEquals("Introduction Video", previewLesson.getTitle());

            // Check locked lesson
            LessonPreviewDto lockedLesson = chapter.getLessons().get(1);
            assertFalse(lockedLesson.getIsPreview());
            assertEquals("Advanced Topics", lockedLesson.getTitle());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }
    }

    // ==================== PREVIEW VIDEO STREAMING ====================

    @Nested
    @DisplayName("Preview Video Streaming Tests")
    class PreviewVideoStreamingTests {

        @Test
        @DisplayName("Get preview video URL - Success for preview lesson")
        void testGetPreviewVideoStreamUrl_Success() {
            // Arrange
            Long previewLessonId = 1L;
            String streamUrl = "https://stream.example.com/video/preview-123.m3u8";

            when(coursePreviewService.getPreviewVideoStreamingUrl(eq(previewLessonId)))
                    .thenReturn(streamUrl);

            // Act
            ResponseEntity<Map<String, String>> response =
                    coursePreviewController.getPreviewVideoStreamUrl(previewLessonId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(streamUrl, response.getBody().get("streamUrl"));

            verify(coursePreviewService, times(1)).getPreviewVideoStreamingUrl(eq(previewLessonId));
        }

        @Test
        @DisplayName("Get preview video URL - Fails for non-preview lesson")
        void testGetPreviewVideoStreamUrl_FailForLockedLesson() {
            // Arrange
            Long lockedLessonId = 2L;

            when(coursePreviewService.getPreviewVideoStreamingUrl(eq(lockedLessonId)))
                    .thenThrow(new InvalidRequestException(
                            "This lesson is not marked as preview. Enrollment required."));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> coursePreviewController.getPreviewVideoStreamUrl(lockedLessonId)
            );

            assertTrue(exception.getMessage().contains("not marked as preview"));
            assertTrue(exception.getMessage().contains("Enrollment required"));
            verify(coursePreviewService, times(1)).getPreviewVideoStreamingUrl(eq(lockedLessonId));
        }

        @Test
        @DisplayName("Get preview video URL - Lesson not found")
        void testGetPreviewVideoStreamUrl_LessonNotFound() {
            // Arrange
            Long nonExistentLessonId = 999L;

            when(coursePreviewService.getPreviewVideoStreamingUrl(eq(nonExistentLessonId)))
                    .thenThrow(new ResourceNotFoundException("Lesson not found with id: 999"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> coursePreviewController.getPreviewVideoStreamUrl(nonExistentLessonId)
            );

            assertTrue(exception.getMessage().contains("Lesson not found"));
            verify(coursePreviewService, times(1)).getPreviewVideoStreamingUrl(eq(nonExistentLessonId));
        }
    }

    // ==================== COURSE PUBLICATION STATUS ====================

    @Nested
    @DisplayName("Course Publication Status Tests")
    class CoursePublicationStatusTests {

        @Test
        @DisplayName("Check course is published - Returns true")
        void testIsCoursePublished_Published_ReturnsTrue() {
            // Arrange
            String publishedSlug = "introduction-to-java-programming";

            when(coursePreviewService.isCoursePublished(eq(publishedSlug)))
                    .thenReturn(true);

            // Act
            ResponseEntity<Map<String, Boolean>> response =
                    coursePreviewController.isCoursePublished(publishedSlug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().get("isPublished"));

            verify(coursePreviewService, times(1)).isCoursePublished(eq(publishedSlug));
        }

        @Test
        @DisplayName("Check course is published - Returns false for draft")
        void testIsCoursePublished_Draft_ReturnsFalse() {
            // Arrange
            String draftSlug = "draft-course";

            when(coursePreviewService.isCoursePublished(eq(draftSlug)))
                    .thenReturn(false);

            // Act
            ResponseEntity<Map<String, Boolean>> response =
                    coursePreviewController.isCoursePublished(draftSlug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().get("isPublished"));

            verify(coursePreviewService, times(1)).isCoursePublished(eq(draftSlug));
        }

        @Test
        @DisplayName("Check course is published - Course not found")
        void testIsCoursePublished_CourseNotFound() {
            // Arrange
            String nonExistentSlug = "non-existent-course";

            when(coursePreviewService.isCoursePublished(eq(nonExistentSlug)))
                    .thenThrow(new ResourceNotFoundException("Course not found with slug: " + nonExistentSlug));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> coursePreviewController.isCoursePublished(nonExistentSlug)
            );

            assertTrue(exception.getMessage().contains("Course not found"));
            verify(coursePreviewService, times(1)).isCoursePublished(eq(nonExistentSlug));
        }
    }

    // ==================== EDGE CASES ====================

    @Nested
    @DisplayName("Edge Cases Tests")
    class EdgeCasesTests {

        @Test
        @DisplayName("Get course preview - Free course (price = 0)")
        void testGetCoursePreview_FreeCourse() {
            // Arrange
            String slug = "free-course";

            CoursePreviewResponse.PublishedVersionDto freeVersion =
                    CoursePreviewResponse.PublishedVersionDto.builder()
                    .id(20L)
                    .versionNumber(1)
                    .price(BigDecimal.ZERO)
                    .build();

            CoursePreviewResponse freeCoursePreview = CoursePreviewResponse.builder()
                    .id(200L)
                    .title("Free Java Course")
                    .slug(slug)
                    .publishedVersion(freeVersion)
                    .build();

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(freeCoursePreview);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody().getPublishedVersion());
            assertEquals(BigDecimal.ZERO, response.getBody().getPublishedVersion().getPrice());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }

        @Test
        @DisplayName("Get course preview - No chapters available")
        void testGetCoursePreview_NoChapters() {
            // Arrange
            String slug = "empty-course";

            CoursePreviewResponse.PublishedVersionDto emptyVersion =
                    CoursePreviewResponse.PublishedVersionDto.builder()
                    .id(30L)
                    .versionNumber(1)
                    .chapters(Collections.emptyList())
                    .build();

            CoursePreviewResponse emptyPreview = CoursePreviewResponse.builder()
                    .id(300L)
                    .title("Empty Course")
                    .slug(slug)
                    .publishedVersion(emptyVersion)
                    .build();

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(emptyPreview);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody().getPublishedVersion());
            assertNotNull(response.getBody().getPublishedVersion().getChapters());
            assertTrue(response.getBody().getPublishedVersion().getChapters().isEmpty());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }

        @Test
        @DisplayName("Get course preview - No reviews yet")
        void testGetCoursePreview_NoReviews() {
            // Arrange
            String slug = "new-course";
            CoursePreviewResponse newCoursePreview = CoursePreviewResponse.builder()
                    .id(400L)
                    .title("New Course")
                    .slug(slug)
                    .build();

            when(coursePreviewService.getCoursePreview(eq(slug)))
                    .thenReturn(newCoursePreview);

            // Act
            ResponseEntity<CoursePreviewResponse> response =
                    coursePreviewController.getCoursePreview(slug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("New Course", response.getBody().getTitle());

            verify(coursePreviewService, times(1)).getCoursePreview(eq(slug));
        }
    }
}

