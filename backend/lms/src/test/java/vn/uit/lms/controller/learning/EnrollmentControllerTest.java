package vn.uit.lms.controller.learning;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import vn.uit.lms.service.learning.EnrollmentService;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.enrollment.CancelEnrollmentRequest;
import vn.uit.lms.shared.dto.request.enrollment.EnrollCourseRequest;
import vn.uit.lms.shared.dto.request.enrollment.UpdateScoreRequest;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentStatsResponse;
import vn.uit.lms.shared.dto.response.enrollment.FinalExamEligibilityResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for EnrollmentController
 * Covers UC-12 (Đăng ký khóa học), UC-13 (Gia hạn / Đăng ký lại)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("EnrollmentController Tests - Course Enrollment & Management")
class EnrollmentControllerTest {

    @Mock
    private EnrollmentService enrollmentService;

    @InjectMocks
    private EnrollmentController enrollmentController;

    private EnrollmentDetailResponse enrollmentDetailResponse;
    private EnrollCourseRequest enrollCourseRequest;
    private CancelEnrollmentRequest cancelEnrollmentRequest;
    private UpdateScoreRequest updateScoreRequest;

    @BeforeEach
    void setUp() {
        // Setup enrollment detail response
        enrollmentDetailResponse = new EnrollmentDetailResponse();
        enrollmentDetailResponse.setId(1L);
        enrollmentDetailResponse.setCourseId(100L);
        enrollmentDetailResponse.setCourseTitle("Introduction to Java");
        enrollmentDetailResponse.setStudentId(1L);
        enrollmentDetailResponse.setStudentName("John Doe");
        enrollmentDetailResponse.setStatus(EnrollmentStatus.ENROLLED);
        enrollmentDetailResponse.setEnrolledAt(Instant.now());
        enrollmentDetailResponse.setCompletionPercentage(0f);
        enrollmentDetailResponse.setAverageScore(0f);

        // Setup enroll course request
        enrollCourseRequest = new EnrollCourseRequest();

        // Setup cancel enrollment request
        cancelEnrollmentRequest = new CancelEnrollmentRequest();
        cancelEnrollmentRequest.setReason("Schedule conflict");

        // Setup update score request
        updateScoreRequest = new UpdateScoreRequest();
        updateScoreRequest.setScore(85.5f);
    }

    // ==================== UC-12: ĐĂNG KÝ KHÓA HỌC ====================

    @Nested
    @DisplayName("UC-12: Course Enrollment Tests")
    class CourseEnrollmentTests {

        @Test
        @DisplayName("UC-12.1: Đăng ký khóa học miễn phí - Thành công ngay")
        void testEnrollFreeCourse_Success() {
            // Arrange
            Long courseId = 100L;
            when(enrollmentService.enrollCourse(eq(courseId), any(EnrollCourseRequest.class)))
                    .thenReturn(enrollmentDetailResponse);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.enrollCourse(courseId, enrollCourseRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1L, response.getBody().getId());
            assertEquals(100L, response.getBody().getCourseId());
            assertEquals("Introduction to Java", response.getBody().getCourseTitle());
            assertEquals(EnrollmentStatus.ENROLLED, response.getBody().getStatus());
            assertNotNull(response.getBody().getEnrolledAt());

            verify(enrollmentService, times(1)).enrollCourse(eq(courseId), any(EnrollCourseRequest.class));
        }

        @Test
        @DisplayName("UC-12.2: Đăng ký khóa học trả phí - Chuyển sang cổng thanh toán")
        void testEnrollPaidCourse_RedirectToPayment() {
            // Arrange
            Long paidCourseId = 200L;
            when(enrollmentService.enrollCourse(eq(paidCourseId), any(EnrollCourseRequest.class)))
                    .thenThrow(new InvalidRequestException(
                            "This is a PAID course (Price: 500000). Please use payment flow to enroll."));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> enrollmentController.enrollCourse(paidCourseId, enrollCourseRequest)
            );

            assertTrue(exception.getMessage().contains("PAID course"));
            assertTrue(exception.getMessage().contains("payment flow"));
            verify(enrollmentService, times(1)).enrollCourse(eq(paidCourseId), any(EnrollCourseRequest.class));
        }

        @Test
        @DisplayName("UC-12.3: Đăng ký khóa học đã đăng ký trước đó - Thất bại")
        void testEnrollCourse_AlreadyEnrolled() {
            // Arrange
            Long courseId = 100L;
            when(enrollmentService.enrollCourse(eq(courseId), any(EnrollCourseRequest.class)))
                    .thenThrow(new InvalidRequestException("Student is already enrolled in this course"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> enrollmentController.enrollCourse(courseId, enrollCourseRequest)
            );

            assertEquals("Student is already enrolled in this course", exception.getMessage());
            verify(enrollmentService, times(1)).enrollCourse(eq(courseId), any(EnrollCourseRequest.class));
        }

        @Test
        @DisplayName("UC-12.4: Đăng ký khóa học không tồn tại - Thất bại")
        void testEnrollCourse_CourseNotFound() {
            // Arrange
            Long nonExistentCourseId = 999L;
            when(enrollmentService.enrollCourse(eq(nonExistentCourseId), any(EnrollCourseRequest.class)))
                    .thenThrow(new ResourceNotFoundException("Course not found with id: 999"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> enrollmentController.enrollCourse(nonExistentCourseId, enrollCourseRequest)
            );

            assertTrue(exception.getMessage().contains("Course not found"));
            verify(enrollmentService, times(1)).enrollCourse(eq(nonExistentCourseId), any(EnrollCourseRequest.class));
        }

        @Test
        @DisplayName("UC-12.5: Đăng ký khóa học đã đóng - Thất bại")
        void testEnrollCourse_CourseClosedForEnrollment() {
            // Arrange
            Long closedCourseId = 150L;
            when(enrollmentService.enrollCourse(eq(closedCourseId), any(EnrollCourseRequest.class)))
                    .thenThrow(new InvalidRequestException("Course is not open for enrollment"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> enrollmentController.enrollCourse(closedCourseId, enrollCourseRequest)
            );

            assertEquals("Course is not open for enrollment", exception.getMessage());
            verify(enrollmentService, times(1)).enrollCourse(eq(closedCourseId), any(EnrollCourseRequest.class));
        }
    }

    // ==================== UC-13: GIA HẠN / ĐĂNG KÝ LẠI ====================

    @Nested
    @DisplayName("UC-13: Re-enrollment & Extension Tests")
    class ReEnrollmentTests {

        @Test
        @DisplayName("UC-13.1: Gia hạn khóa học đã hết hạn - Thanh toán thành công")
        void testReEnrollExpiredCourse_Success() {
            // Arrange
            Long courseId = 100L;
            EnrollmentDetailResponse renewedEnrollment = new EnrollmentDetailResponse();
            renewedEnrollment.setId(2L);
            renewedEnrollment.setCourseId(courseId);
            renewedEnrollment.setStudentId(1L);
            renewedEnrollment.setStatus(EnrollmentStatus.ENROLLED);
            Instant now = Instant.now();
            renewedEnrollment.setEnrolledAt(now);
            renewedEnrollment.setStartAt(now);
            renewedEnrollment.setEndAt(now.plusSeconds(180 * 24 * 60 * 60)); // +6 months

            when(enrollmentService.enrollCourse(eq(courseId), any(EnrollCourseRequest.class)))
                    .thenReturn(renewedEnrollment);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.enrollCourse(courseId, enrollCourseRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(EnrollmentStatus.ENROLLED, response.getBody().getStatus());
            assertNotNull(response.getBody().getStartAt());
            assertNotNull(response.getBody().getEndAt());
            assertTrue(response.getBody().getEndAt().isAfter(Instant.now()));

            verify(enrollmentService, times(1)).enrollCourse(eq(courseId), any(EnrollCourseRequest.class));
        }

        @Test
        @DisplayName("UC-13.2: Đăng ký học lại để cải thiện điểm - Thành công")
        void testReEnrollToImproveScore_Success() {
            // Arrange
            Long courseId = 100L;
            EnrollmentDetailResponse reEnrollment = new EnrollmentDetailResponse();
            reEnrollment.setId(3L);
            reEnrollment.setCourseId(courseId);
            reEnrollment.setStudentId(1L);
            reEnrollment.setStatus(EnrollmentStatus.ENROLLED);
            reEnrollment.setAverageScore(0f); // Reset for new attempt

            when(enrollmentService.enrollCourse(eq(courseId), any(EnrollCourseRequest.class)))
                    .thenReturn(reEnrollment);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.enrollCourse(courseId, enrollCourseRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(0f, response.getBody().getAverageScore()); // Score reset for retake

            verify(enrollmentService, times(1)).enrollCourse(eq(courseId), any(EnrollCourseRequest.class));
        }
    }

    // ==================== ENROLLMENT MANAGEMENT ====================

    @Nested
    @DisplayName("Enrollment Management Tests")
    class EnrollmentManagementTests {

        @Test
        @DisplayName("Get student enrollments - Success")
        void testGetStudentEnrollments_Success() {
            // Arrange
            Long studentId = 1L;
            Pageable pageable = PageRequest.of(0, 20);

            EnrollmentResponse enrollment1 = new EnrollmentResponse();
            enrollment1.setId(1L);
            enrollment1.setCourseTitle("Java Basics");
            enrollment1.setStatus(EnrollmentStatus.ENROLLED);

            EnrollmentResponse enrollment2 = new EnrollmentResponse();
            enrollment2.setId(2L);
            enrollment2.setCourseTitle("Advanced Java");
            enrollment2.setStatus(EnrollmentStatus.COMPLETED);

            PageResponse<EnrollmentResponse> pageResponse = new PageResponse<>(
                    Arrays.asList(enrollment1, enrollment2), 0, 20, 2L, 1, true, true);

            when(enrollmentService.getStudentEnrollments(eq(studentId), any(Pageable.class)))
                    .thenReturn(pageResponse);

            // Act
            ResponseEntity<PageResponse<EnrollmentResponse>> response =
                    enrollmentController.getStudentEnrollments(studentId, pageable);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().getItems().size());
            assertEquals("Java Basics", response.getBody().getItems().get(0).getCourseTitle());
            assertEquals("Advanced Java", response.getBody().getItems().get(1).getCourseTitle());

            verify(enrollmentService, times(1)).getStudentEnrollments(eq(studentId), any(Pageable.class));
        }

        @Test
        @DisplayName("Get course enrollments (Teacher) - Success")
        void testGetCourseEnrollments_Success() {
            // Arrange
            Long courseId = 100L;
            Pageable pageable = PageRequest.of(0, 20);

            EnrollmentResponse enrollment1 = new EnrollmentResponse();
            enrollment1.setId(1L);
            enrollment1.setStudentName("John Doe");
            enrollment1.setStatus(EnrollmentStatus.ENROLLED);

            PageResponse<EnrollmentResponse> pageResponse = new PageResponse<>(
                    Collections.singletonList(enrollment1), 0, 20, 1L, 1, true, true);

            when(enrollmentService.getCourseEnrollments(eq(courseId), any(Pageable.class)))
                    .thenReturn(pageResponse);

            // Act
            ResponseEntity<PageResponse<EnrollmentResponse>> response =
                    enrollmentController.getCourseEnrollments(courseId, pageable);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1, response.getBody().getItems().size());

            verify(enrollmentService, times(1)).getCourseEnrollments(eq(courseId), any(Pageable.class));
        }

        @Test
        @DisplayName("Get enrollment detail - Success")
        void testGetEnrollmentDetail_Success() {
            // Arrange
            Long enrollmentId = 1L;
            when(enrollmentService.getEnrollmentDetail(eq(enrollmentId)))
                    .thenReturn(enrollmentDetailResponse);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.getEnrollmentDetail(enrollmentId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1L, response.getBody().getId());

            verify(enrollmentService, times(1)).getEnrollmentDetail(eq(enrollmentId));
        }

        @Test
        @DisplayName("Cancel enrollment - Success")
        void testCancelEnrollment_Success() {
            // Arrange
            Long enrollmentId = 1L;
            EnrollmentDetailResponse cancelledEnrollment = new EnrollmentDetailResponse();
            cancelledEnrollment.setId(enrollmentId);
            cancelledEnrollment.setStatus(EnrollmentStatus.CANCELLED);
            cancelledEnrollment.setCancellationReason("Schedule conflict");

            when(enrollmentService.cancelEnrollment(eq(enrollmentId), any(CancelEnrollmentRequest.class)))
                    .thenReturn(cancelledEnrollment);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.cancelEnrollment(enrollmentId, cancelEnrollmentRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(EnrollmentStatus.CANCELLED, response.getBody().getStatus());
            assertEquals("Schedule conflict", response.getBody().getCancellationReason());

            verify(enrollmentService, times(1)).cancelEnrollment(eq(enrollmentId), any(CancelEnrollmentRequest.class));
        }

        @Test
        @DisplayName("Kick student from course - Success")
        void testKickStudent_Success() {
            // Arrange
            Long enrollmentId = 1L;
            EnrollmentDetailResponse kickedEnrollment = new EnrollmentDetailResponse();
            kickedEnrollment.setId(enrollmentId);
            kickedEnrollment.setStatus(EnrollmentStatus.CANCELLED);
            kickedEnrollment.setCancellationReason("Violation of course rules");

            when(enrollmentService.kickStudent(eq(enrollmentId), any(CancelEnrollmentRequest.class)))
                    .thenReturn(kickedEnrollment);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.kickStudent(enrollmentId, cancelEnrollmentRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(EnrollmentStatus.CANCELLED, response.getBody().getStatus());

            verify(enrollmentService, times(1)).kickStudent(eq(enrollmentId), any(CancelEnrollmentRequest.class));
        }

        @Test
        @DisplayName("Complete enrollment - Success")
        void testCompleteEnrollment_Success() {
            // Arrange
            Long enrollmentId = 1L;
            EnrollmentDetailResponse completedEnrollment = new EnrollmentDetailResponse();
            completedEnrollment.setId(enrollmentId);
            completedEnrollment.setStatus(EnrollmentStatus.COMPLETED);
            completedEnrollment.setCompletionPercentage(100f);
            completedEnrollment.setAverageScore(85.5f);
            completedEnrollment.setCompletedAt(Instant.now());

            when(enrollmentService.completeEnrollment(eq(enrollmentId)))
                    .thenReturn(completedEnrollment);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.completeEnrollment(enrollmentId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(EnrollmentStatus.COMPLETED, response.getBody().getStatus());
            assertEquals(100f, response.getBody().getCompletionPercentage());
            assertNotNull(response.getBody().getCompletedAt());

            verify(enrollmentService, times(1)).completeEnrollment(eq(enrollmentId));
        }
    }

    // ==================== ENROLLMENT STATISTICS ====================

    @Nested
    @DisplayName("Enrollment Statistics Tests")
    class EnrollmentStatsTests {

        @Test
        @DisplayName("Get enrollment statistics - Success")
        void testGetEnrollmentStats_Success() {
            // Arrange
            Long courseId = 100L;
            EnrollmentStatsResponse statsResponse = new EnrollmentStatsResponse();
            statsResponse.setTotalEnrollments(150L);
            statsResponse.setActiveEnrollments(120L);
            statsResponse.setCompletedEnrollments(25L);
            statsResponse.setCancelledEnrollments(5L);
            statsResponse.setAverageCompletionPercentage(65.5);
            statsResponse.setAverageScore(78.3);

            when(enrollmentService.getEnrollmentStats(eq(courseId)))
                    .thenReturn(statsResponse);

            // Act
            ResponseEntity<EnrollmentStatsResponse> response =
                    enrollmentController.getEnrollmentStats(courseId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(150L, response.getBody().getTotalEnrollments());
            assertEquals(120L, response.getBody().getActiveEnrollments());
            assertEquals(25L, response.getBody().getCompletedEnrollments());
            assertEquals(65.5, response.getBody().getAverageCompletionPercentage());

            verify(enrollmentService, times(1)).getEnrollmentStats(eq(courseId));
        }

        @Test
        @DisplayName("Update enrollment score - Success")
        void testUpdateScore_Success() {
            // Arrange
            Long enrollmentId = 1L;
            EnrollmentDetailResponse updatedEnrollment = new EnrollmentDetailResponse();
            updatedEnrollment.setId(enrollmentId);
            updatedEnrollment.setAverageScore(85.5f);

            when(enrollmentService.updateScore(eq(enrollmentId), any(UpdateScoreRequest.class)))
                    .thenReturn(updatedEnrollment);

            // Act
            ResponseEntity<EnrollmentDetailResponse> response =
                    enrollmentController.updateScore(enrollmentId, updateScoreRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(85.5f, response.getBody().getAverageScore());

            verify(enrollmentService, times(1)).updateScore(eq(enrollmentId), any(UpdateScoreRequest.class));
        }

        @Test
        @DisplayName("Check final exam eligibility - Eligible")
        void testCheckFinalExamEligibility_Eligible() {
            // Arrange
            Long enrollmentId = 1L;
            FinalExamEligibilityResponse eligibilityResponse = FinalExamEligibilityResponse.builder()
                    .enrollmentId(enrollmentId)
                    .isEligible(true)
                    .currentProgress(90f)
                    .requiredProgress(80f)
                    .reason("You are eligible to take the final exam")
                    .build();

            when(enrollmentService.checkFinalExamEligibility(eq(enrollmentId)))
                    .thenReturn(eligibilityResponse);

            // Act
            ResponseEntity<FinalExamEligibilityResponse> response =
                    enrollmentController.checkFinalExamEligibility(enrollmentId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(true, response.getBody().getIsEligible());
            assertEquals(90f, response.getBody().getCurrentProgress());

            verify(enrollmentService, times(1)).checkFinalExamEligibility(eq(enrollmentId));
        }

        @Test
        @DisplayName("Check final exam eligibility - Not Eligible")
        void testCheckFinalExamEligibility_NotEligible() {
            // Arrange
            Long enrollmentId = 1L;
            FinalExamEligibilityResponse eligibilityResponse = FinalExamEligibilityResponse.builder()
                    .enrollmentId(enrollmentId)
                    .isEligible(false)
                    .currentProgress(70f)
                    .requiredProgress(80f)
                    .reason("You need to complete 80% of the course to be eligible")
                    .build();

            when(enrollmentService.checkFinalExamEligibility(eq(enrollmentId)))
                    .thenReturn(eligibilityResponse);

            // Act
            ResponseEntity<FinalExamEligibilityResponse> response =
                    enrollmentController.checkFinalExamEligibility(enrollmentId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(false, response.getBody().getIsEligible());
            assertEquals(70f, response.getBody().getCurrentProgress());
            assertTrue(response.getBody().getReason().contains("80%"));

            verify(enrollmentService, times(1)).checkFinalExamEligibility(eq(enrollmentId));
        }
    }
}

