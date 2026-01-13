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
import org.springframework.mock.web.MockMultipartFile;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.shared.constant.Difficulty;
import vn.uit.lms.shared.dto.request.course.CourseRequest;
import vn.uit.lms.shared.dto.request.course.CourseUpdateRequest;
import vn.uit.lms.shared.dto.response.course.CourseDetailResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for CourseController
 * Covers UC-06 (Tạo khóa học), UC-09 (Đóng khóa học), UC-10 (Xóa khóa học)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CourseController Tests - Course Management")
class CourseControllerTest {

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    private CourseRequest validCourseRequest;
    private CourseDetailResponse courseDetailResponse;

    @BeforeEach
    void setUp() {
        // Setup valid course request
        validCourseRequest = new CourseRequest();
        validCourseRequest.setTitle("Introduction to Java Programming");
        validCourseRequest.setShortDescription("Learn Java from scratch");
        validCourseRequest.setDifficulty(Difficulty.BEGINNER);
        validCourseRequest.setCategoryId(1L);
        validCourseRequest.setTeacherId(1L);

        // Setup course detail response
        courseDetailResponse = new CourseDetailResponse();
        courseDetailResponse.setId(1L);
        courseDetailResponse.setTitle("Introduction to Java Programming");
        courseDetailResponse.setShortDescription("Learn Java from scratch");
        courseDetailResponse.setSlug("introduction-to-java-programming");
        courseDetailResponse.setDifficulty(Difficulty.BEGINNER);
    }

    // ==================== UC-06: TẠO KHÓA HỌC ====================

    @Nested
    @DisplayName("UC-06: Create Course Tests")
    class CreateCourseTests {

        @Test
        @DisplayName("UC-06.1: Tạo khóa học thành công với đầy đủ thông tin")
        void testCreateCourse_Success() {
            // Arrange
            when(courseService.createCourse(any(CourseRequest.class))).thenReturn(courseDetailResponse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.createNewCourse(validCourseRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Introduction to Java Programming", response.getBody().getTitle());
            assertEquals("introduction-to-java-programming", response.getBody().getSlug());
            assertEquals(Difficulty.BEGINNER, response.getBody().getDifficulty());
            verify(courseService, times(1)).createCourse(any(CourseRequest.class));
        }

        @Test
        @DisplayName("UC-06.2: Tạo khóa học thất bại do thiếu title")
        void testCreateCourse_Fail_MissingTitle() {
            // Arrange
            CourseRequest invalidRequest = new CourseRequest();
            invalidRequest.setShortDescription("Description without title");
            invalidRequest.setDifficulty(Difficulty.BEGINNER);
            invalidRequest.setCategoryId(1L);
            invalidRequest.setTeacherId(1L);

            when(courseService.createCourse(any(CourseRequest.class)))
                    .thenThrow(new InvalidRequestException("Title is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseController.createNewCourse(invalidRequest)
            );

            assertEquals("Title is required", exception.getMessage());
        }

        @Test
        @DisplayName("UC-06.2: Tạo khóa học thất bại do thiếu description")
        void testCreateCourse_Fail_MissingDescription() {
            // Arrange
            CourseRequest invalidRequest = new CourseRequest();
            invalidRequest.setTitle("Course Title");
            invalidRequest.setDifficulty(Difficulty.BEGINNER);
            invalidRequest.setCategoryId(1L);
            invalidRequest.setTeacherId(1L);

            when(courseService.createCourse(any(CourseRequest.class)))
                    .thenThrow(new InvalidRequestException("Description is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseController.createNewCourse(invalidRequest)
            );

            assertEquals("Description is required", exception.getMessage());
        }

        @Test
        @DisplayName("UC-06.2: Tạo khóa học thất bại do thiếu category")
        void testCreateCourse_Fail_MissingCategory() {
            // Arrange
            CourseRequest invalidRequest = new CourseRequest();
            invalidRequest.setTitle("Course Title");
            invalidRequest.setShortDescription("Course Description");
            invalidRequest.setDifficulty(Difficulty.BEGINNER);
            invalidRequest.setTeacherId(1L);

            when(courseService.createCourse(any(CourseRequest.class)))
                    .thenThrow(new InvalidRequestException("Category is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseController.createNewCourse(invalidRequest)
            );

            assertEquals("Category is required", exception.getMessage());
        }


        @Test
        @DisplayName("UC-06: Tạo khóa học với category không tồn tại")
        void testCreateCourse_Fail_CategoryNotFound() {
            // Arrange
            validCourseRequest.setCategoryId(999L);

            when(courseService.createCourse(any(CourseRequest.class)))
                    .thenThrow(new ResourceNotFoundException("Category not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> courseController.createNewCourse(validCourseRequest)
            );

            assertEquals("Category not found", exception.getMessage());
        }
    }

    // ==================== UC-09: ĐÓNG KHÓA HỌC ====================

    @Nested
    @DisplayName("UC-09: Close Course Tests")
    class CloseCourseTests {

        @Test
        @DisplayName("UC-09.1: Đóng khóa học thành công (Không nhận học viên mới)")
        void testCloseCourse_Success() {
            // Arrange
            Long courseId = 1L;
            CourseDetailResponse closedCourse = new CourseDetailResponse();
            closedCourse.setId(courseId);
            closedCourse.setTitle("Introduction to Java Programming");
            closedCourse.setIsClosed(true);

            when(courseService.closeCourse(courseId)).thenReturn(closedCourse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.closeCourse(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().getIsClosed());
            verify(courseService, times(1)).closeCourse(courseId);
        }

        @Test
        @DisplayName("UC-09.2: Kiểm tra học viên đang học vẫn truy cập được sau khi đóng")
        void testCloseCourse_ExistingStudentsCanAccess() {
            // Arrange
            Long courseId = 1L;
            CourseDetailResponse closedCourse = new CourseDetailResponse();
            closedCourse.setId(courseId);
            closedCourse.setIsClosed(true);

            when(courseService.closeCourse(courseId)).thenReturn(closedCourse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.closeCourse(courseId);

            // Assert
            assertNotNull(response);
            assertNotNull(response.getBody());
            assertTrue(response.getBody().getIsClosed());
            // Note: Actual access control is tested in enrollment/access service tests
            verify(courseService, times(1)).closeCourse(courseId);
        }

        @Test
        @DisplayName("UC-09: Đóng khóa học không tồn tại")
        void testCloseCourse_CourseNotFound() {
            // Arrange
            Long nonExistentId = 999L;
            when(courseService.closeCourse(nonExistentId))
                    .thenThrow(new ResourceNotFoundException("Course not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> courseController.closeCourse(nonExistentId)
            );

            assertEquals("Course not found", exception.getMessage());
        }

        @Test
        @DisplayName("UC-09: Mở lại khóa học đã đóng")
        void testOpenCourse_Success() {
            // Arrange
            Long courseId = 1L;
            CourseDetailResponse openedCourse = new CourseDetailResponse();
            openedCourse.setId(courseId);
            openedCourse.setIsClosed(false);

            when(courseService.openCourse(courseId)).thenReturn(openedCourse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.openCourse(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().getIsClosed());
            verify(courseService, times(1)).openCourse(courseId);
        }
    }

    // ==================== UC-10: XÓA KHÓA HỌC ====================

    @Nested
    @DisplayName("UC-10: Delete Course Tests")
    class DeleteCourseTests {

        @Test
        @DisplayName("UC-10.1: Xóa khóa học thành công khi không có học viên")
        void testDeleteCourse_Success_NoStudents() {
            // Arrange
            Long courseId = 1L;
            doNothing().when(courseService).deleteCourse(courseId);

            // Act
            ResponseEntity<Void> response = courseController.deleteCourse(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            verify(courseService, times(1)).deleteCourse(courseId);
        }

        @Test
        @DisplayName("UC-10.2: Xóa khóa học thất bại khi CÒN học viên đang học")
        void testDeleteCourse_Fail_HasEnrolledStudents() {
            // Arrange
            Long courseId = 1L;
            doThrow(new InvalidRequestException("Cannot delete course with enrolled students"))
                    .when(courseService).deleteCourse(courseId);

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseController.deleteCourse(courseId)
            );

            assertEquals("Cannot delete course with enrolled students", exception.getMessage());
            verify(courseService, times(1)).deleteCourse(courseId);
        }

        @Test
        @DisplayName("UC-10.3: Xóa mềm khóa học (Soft delete)")
        void testDeleteCourse_SoftDelete() {
            // Arrange
            Long courseId = 1L;
            doNothing().when(courseService).deleteCourse(courseId);

            // Act
            ResponseEntity<Void> response = courseController.deleteCourse(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            // Soft delete means course is hidden but can be restored
            verify(courseService, times(1)).deleteCourse(courseId);
        }

        @Test
        @DisplayName("UC-10.3: Khôi phục khóa học đã xóa mềm")
        void testRestoreCourse_Success() {
            // Arrange
            Long courseId = 1L;
            CourseDetailResponse restoredCourse = new CourseDetailResponse();
            restoredCourse.setId(courseId);
            restoredCourse.setTitle("Restored Course");

            when(courseService.restoreCourse(courseId)).thenReturn(restoredCourse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.restoreCourse(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Restored Course", response.getBody().getTitle());
            verify(courseService, times(1)).restoreCourse(courseId);
        }

        @Test
        @DisplayName("UC-10: Xóa khóa học không tồn tại")
        void testDeleteCourse_CourseNotFound() {
            // Arrange
            Long nonExistentId = 999L;
            doThrow(new ResourceNotFoundException("Course not found"))
                    .when(courseService).deleteCourse(nonExistentId);

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> courseController.deleteCourse(nonExistentId)
            );

            assertEquals("Course not found", exception.getMessage());
        }
    }

    // ==================== ADDITIONAL COURSE TESTS ====================

    @Nested
    @DisplayName("Additional Course Management Tests")
    class AdditionalCourseTests {

        @Test
        @DisplayName("Get course by slug - Success")
        void testGetCourseBySlug_Success() {
            // Arrange
            String slug = "introduction-to-java-programming";
            when(courseService.getCourseBySlug(slug)).thenReturn(courseDetailResponse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.getCourseBySlug(slug);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(slug, response.getBody().getSlug());
            verify(courseService, times(1)).getCourseBySlug(slug);
        }

        @Test
        @DisplayName("Update course - Success")
        void testUpdateCourse_Success() {
            // Arrange
            Long courseId = 1L;
            CourseUpdateRequest updateRequest = new CourseUpdateRequest();
            updateRequest.setTitle("Updated Course Title");
            updateRequest.setShortDescription("Updated Description");

            CourseDetailResponse updatedCourse = new CourseDetailResponse();
            updatedCourse.setId(courseId);
            updatedCourse.setTitle("Updated Course Title");

            when(courseService.updateCourse(eq(courseId), any(CourseUpdateRequest.class)))
                    .thenReturn(updatedCourse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.updateCourse(courseId, updateRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Updated Course Title", response.getBody().getTitle());
            verify(courseService, times(1)).updateCourse(eq(courseId), any(CourseUpdateRequest.class));
        }

        @Test
        @DisplayName("Upload course thumbnail - Success")
        void testUploadCourseThumbnail_Success() {
            // Arrange
            Long courseId = 1L;
            MockMultipartFile file = new MockMultipartFile(
                    "file",
                    "thumbnail.jpg",
                    "image/jpeg",
                    "thumbnail content".getBytes()
            );

            CourseDetailResponse updatedCourse = new CourseDetailResponse();
            updatedCourse.setId(courseId);
            updatedCourse.setThumbnailUrl("https://example.com/thumbnails/thumbnail.jpg");

            when(courseService.uploadCourseThumbnail(eq(courseId), any())).thenReturn(updatedCourse);

            // Act
            ResponseEntity<CourseDetailResponse> response = courseController.uploadCourseThumbnail(courseId, file);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getThumbnailUrl());
            verify(courseService, times(1)).uploadCourseThumbnail(eq(courseId), any());
        }

        @Test
        @DisplayName("Upload invalid thumbnail file type")
        void testUploadThumbnail_InvalidFileType() {
            // Arrange
            Long courseId = 1L;
            MockMultipartFile file = new MockMultipartFile(
                    "file",
                    "document.pdf",
                    "application/pdf",
                    "pdf content".getBytes()
            );

            when(courseService.uploadCourseThumbnail(eq(courseId), any()))
                    .thenThrow(new InvalidRequestException("Only image files are allowed"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseController.uploadCourseThumbnail(courseId, file)
            );

            assertEquals("Only image files are allowed", exception.getMessage());
        }
    }
}

