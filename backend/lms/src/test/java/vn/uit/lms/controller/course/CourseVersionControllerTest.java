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
import vn.uit.lms.service.course.CourseVersionService;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.course.CourseVersionRequest;
import vn.uit.lms.shared.dto.response.course.CourseVersionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for CourseVersionController
 * Covers UC-07 (Duyệt/Xuất bản khóa học), UC-08 (Chỉnh sửa và lưu phiên bản)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CourseVersionController Tests - Version & Approval Management")
class CourseVersionControllerTest {

    @Mock
    private CourseVersionService courseVersionService;

    @InjectMocks
    private CourseVersionController courseVersionController;

    private CourseVersionRequest versionRequest;
    private CourseVersionResponse versionResponse;
    private Long courseId;
    private Long versionId;

    @BeforeEach
    void setUp() {
        courseId = 1L;
        versionId = 1L;

        // Setup version request
        versionRequest = new CourseVersionRequest();
        versionRequest.setTitle("Course Version 1.0");
        versionRequest.setDescription("Initial version");

        // Setup version response
        versionResponse = new CourseVersionResponse();
        versionResponse.setId(versionId);
        versionResponse.setCourseId(courseId);
        versionResponse.setVersionNumber(1);
        versionResponse.setTitle("Course Version 1.0");
        versionResponse.setStatus(CourseStatus.DRAFT);
    }

    // ==================== UC-07: DUYỆT / XUẤT BẢN KHÓA HỌC ====================

    @Nested
    @DisplayName("UC-07: Course Approval & Publishing Tests")
    class CourseApprovalTests {

        @Test
        @DisplayName("UC-07.1: Admin duyệt khóa học (Chờ duyệt -> Approved)")
        void testApproveCourseVersion_Success() {
            // Arrange
            CourseVersionResponse approvedVersion = new CourseVersionResponse();
            approvedVersion.setId(versionId);
            approvedVersion.setCourseId(courseId);
            approvedVersion.setStatus(CourseStatus.APPROVED);

            when(courseVersionService.approveCourseVersion(courseId, versionId))
                    .thenReturn(approvedVersion);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.approveCourseVersion(courseId, versionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(CourseStatus.APPROVED, response.getBody().getStatus());
            verify(courseVersionService, times(1)).approveCourseVersion(courseId, versionId);
        }

        @Test
        @DisplayName("UC-07.2: Admin từ chối duyệt (Chờ duyệt -> Rejected + Lý do)")
        void testRejectCourseVersion_WithReason() {
            // Arrange
            RejectRequest rejectRequest = new RejectRequest();
            rejectRequest.setReason("Content does not meet quality standards");

            CourseVersionResponse rejectedVersion = new CourseVersionResponse();
            rejectedVersion.setId(versionId);
            rejectedVersion.setCourseId(courseId);
            rejectedVersion.setStatus(CourseStatus.REJECTED);

            when(courseVersionService.rejectCourseVersion(eq(courseId), eq(versionId), any(RejectRequest.class)))
                    .thenReturn(rejectedVersion);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.rejectCourseVersion(courseId, versionId, rejectRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(CourseStatus.REJECTED, response.getBody().getStatus());
            verify(courseVersionService, times(1)).rejectCourseVersion(eq(courseId), eq(versionId), any(RejectRequest.class));
        }

        @Test
        @DisplayName("UC-07.2: Từ chối duyệt thất bại do thiếu lý do")
        void testRejectCourseVersion_MissingReason() {
            // Arrange
            RejectRequest invalidRequest = new RejectRequest();
            // No reason provided

            when(courseVersionService.rejectCourseVersion(eq(courseId), eq(versionId), any(RejectRequest.class)))
                    .thenThrow(new InvalidRequestException("Rejection reason is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseVersionController.rejectCourseVersion(courseId, versionId, invalidRequest)
            );

            assertEquals("Rejection reason is required", exception.getMessage());
        }

        @Test
        @DisplayName("UC-07.3: Xuất bản khóa học sau khi được duyệt")
        void testPublishCourseVersion_Success() {
            // Arrange
            CourseVersionResponse publishedVersion = new CourseVersionResponse();
            publishedVersion.setId(versionId);
            publishedVersion.setCourseId(courseId);
            publishedVersion.setStatus(CourseStatus.PUBLISHED);

            when(courseVersionService.publishCourseVersion(courseId, versionId))
                    .thenReturn(publishedVersion);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.publishCourseVersion(courseId, versionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(CourseStatus.PUBLISHED, response.getBody().getStatus());
            verify(courseVersionService, times(1)).publishCourseVersion(courseId, versionId);
        }

        @Test
        @DisplayName("UC-07: Submit version để chờ duyệt")
        void testSubmitForApproval_Success() {
            // Arrange
            CourseVersionResponse pendingVersion = new CourseVersionResponse();
            pendingVersion.setId(versionId);
            pendingVersion.setStatus(CourseStatus.PENDING);

            when(courseVersionService.submitCourseVersionToApprove(courseId, versionId))
                    .thenReturn(pendingVersion);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.submitApproval(courseId, versionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(CourseStatus.PENDING, response.getBody().getStatus());
            verify(courseVersionService, times(1)).submitCourseVersionToApprove(courseId, versionId);
        }

        @Test
        @DisplayName("UC-07: Không thể duyệt version không ở trạng thái PENDING")
        void testApproveCourseVersion_InvalidStatus() {
            // Arrange
            when(courseVersionService.approveCourseVersion(courseId, versionId))
                    .thenThrow(new InvalidRequestException("Only PENDING versions can be approved"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseVersionController.approveCourseVersion(courseId, versionId)
            );

            assertEquals("Only PENDING versions can be approved", exception.getMessage());
        }

        @Test
        @DisplayName("UC-07: Không thể xuất bản version chưa được duyệt")
        void testPublishCourseVersion_NotApproved() {
            // Arrange
            when(courseVersionService.publishCourseVersion(courseId, versionId))
                    .thenThrow(new InvalidRequestException("Only APPROVED versions can be published"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseVersionController.publishCourseVersion(courseId, versionId)
            );

            assertEquals("Only APPROVED versions can be published", exception.getMessage());
        }
    }

    // ==================== UC-08: CHỈNH SỬA VÀ LƯU PHIÊN BẢN ====================

    @Nested
    @DisplayName("UC-08: Edit & Version Management Tests")
    class EditVersionTests {

        @Test
        @DisplayName("UC-08.1: Giảng viên chỉnh sửa nội dung khóa học đã xuất bản")
        void testCreateNewVersion_AfterPublished() {
            // Arrange
            CourseVersionResponse newVersion = new CourseVersionResponse();
            newVersion.setId(2L);
            newVersion.setCourseId(courseId);
            newVersion.setVersionNumber(2);
            newVersion.setStatus(CourseStatus.DRAFT);

            when(courseVersionService.createCourseVersion(eq(courseId), any(CourseVersionRequest.class)))
                    .thenReturn(newVersion);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.createCourseVersion(courseId, versionRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(Integer.valueOf(2), response.getBody().getVersionNumber());
            assertEquals(CourseStatus.DRAFT, response.getBody().getStatus());
            verify(courseVersionService, times(1)).createCourseVersion(eq(courseId), any(CourseVersionRequest.class));
        }

        @Test
        @DisplayName("UC-08.2: Lưu phiên bản mới thành công")
        void testUpdateVersion_Success() {
            // Arrange
            CourseVersionRequest updateRequest = new CourseVersionRequest();
            updateRequest.setTitle("Updated Version Title");
            updateRequest.setDescription("Updated content");

            CourseVersionResponse updatedVersion = new CourseVersionResponse();
            updatedVersion.setId(versionId);
            updatedVersion.setTitle("Updated Version Title");

            when(courseVersionService.updateCourseVersion(eq(courseId), eq(versionId), any(CourseVersionRequest.class)))
                    .thenReturn(updatedVersion);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.updateCourseVersion(courseId, versionId, updateRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Updated Version Title", response.getBody().getTitle());
            verify(courseVersionService, times(1)).updateCourseVersion(eq(courseId), eq(versionId), any(CourseVersionRequest.class));
        }

        @Test
        @DisplayName("UC-08.3: Kiểm tra nhiều version cùng tồn tại")
        void testGetAllVersions_MultipleVersions() {
            // Arrange
            CourseVersionResponse version1 = new CourseVersionResponse();
            version1.setId(1L);
            version1.setVersionNumber(1);
            version1.setStatus(CourseStatus.PUBLISHED);

            CourseVersionResponse version2 = new CourseVersionResponse();
            version2.setId(2L);
            version2.setVersionNumber(2);
            version2.setStatus(CourseStatus.DRAFT);

            List<CourseVersionResponse> versions = Arrays.asList(version1, version2);

            when(courseVersionService.getCourseVersions(courseId)).thenReturn(versions);

            // Act
            ResponseEntity<List<CourseVersionResponse>> response =
                    courseVersionController.getCourseVersions(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().size());
            assertEquals(Integer.valueOf(1), response.getBody().get(0).getVersionNumber());
            assertEquals(Integer.valueOf(2), response.getBody().get(1).getVersionNumber());
            verify(courseVersionService, times(1)).getCourseVersions(courseId);
        }

        @Test
        @DisplayName("UC-08: Chỉ được chỉnh sửa version ở trạng thái DRAFT hoặc REJECTED")
        void testUpdateVersion_OnlyDraftOrRejected() {
            // Arrange
            when(courseVersionService.updateCourseVersion(eq(courseId), eq(versionId), any(CourseVersionRequest.class)))
                    .thenThrow(new InvalidRequestException("Only DRAFT or REJECTED versions can be updated"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseVersionController.updateCourseVersion(courseId, versionId, versionRequest)
            );

            assertEquals("Only DRAFT or REJECTED versions can be updated", exception.getMessage());
        }

        @Test
        @DisplayName("UC-08: Xóa version DRAFT")
        void testDeleteVersion_Draft() {
            // Arrange
            doNothing().when(courseVersionService).deleteCourseVersion(courseId, versionId);

            // Act
            ResponseEntity<Void> response = courseVersionController.deleteCourseVersion(courseId, versionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            verify(courseVersionService, times(1)).deleteCourseVersion(courseId, versionId);
        }

        @Test
        @DisplayName("UC-08: Không thể xóa version đã PUBLISHED")
        void testDeleteVersion_Published_Fail() {
            // Arrange
            doThrow(new InvalidRequestException("Cannot delete PUBLISHED version"))
                    .when(courseVersionService).deleteCourseVersion(courseId, versionId);

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> courseVersionController.deleteCourseVersion(courseId, versionId)
            );

            assertEquals("Cannot delete PUBLISHED version", exception.getMessage());
        }
    }

    // ==================== ADDITIONAL VERSION TESTS ====================

    @Nested
    @DisplayName("Additional Version Management Tests")
    class AdditionalVersionTests {

        @Test
        @DisplayName("Get version by ID - Success")
        void testGetVersionById_Success() {
            // Arrange
            when(courseVersionService.getCourseVersionById(courseId, versionId))
                    .thenReturn(versionResponse);

            // Act
            ResponseEntity<CourseVersionResponse> response =
                    courseVersionController.getCourseVersionById(courseId, versionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(versionId, response.getBody().getId());
            verify(courseVersionService, times(1)).getCourseVersionById(courseId, versionId);
        }

        @Test
        @DisplayName("Get versions by status")
        void testGetVersionsByStatus() {
            // Arrange
            String status = "PUBLISHED";
            List<CourseVersionResponse> publishedVersions = List.of(versionResponse);

            when(courseVersionService.getCourseVersionsByStatus(courseId, status))
                    .thenReturn(publishedVersions);

            // Act
            ResponseEntity<List<CourseVersionResponse>> response =
                    courseVersionController.getCourseVersionsByStatus(courseId, status);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1, response.getBody().size());
            verify(courseVersionService, times(1)).getCourseVersionsByStatus(courseId, status);
        }

        @Test
        @DisplayName("Get deleted versions")
        void testGetDeletedVersions() {
            // Arrange
            List<CourseVersionResponse> deletedVersions = List.of(versionResponse);

            when(courseVersionService.getDeletedCourseVersions(courseId))
                    .thenReturn(deletedVersions);

            // Act
            ResponseEntity<List<CourseVersionResponse>> response =
                    courseVersionController.getDeletedCourseVersion(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(courseVersionService, times(1)).getDeletedCourseVersions(courseId);
        }

        @Test
        @DisplayName("Version not found")
        void testGetVersion_NotFound() {
            // Arrange
            when(courseVersionService.getCourseVersionById(courseId, 999L))
                    .thenThrow(new ResourceNotFoundException("Version not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> courseVersionController.getCourseVersionById(courseId, 999L)
            );

            assertEquals("Version not found", exception.getMessage());
        }
    }
}

