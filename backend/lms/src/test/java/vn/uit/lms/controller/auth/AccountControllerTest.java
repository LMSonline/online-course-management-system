package vn.uit.lms.controller.auth;

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
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.request.account.AccountActionRequest;
import vn.uit.lms.shared.dto.request.account.UpdateProfileRequest;
import vn.uit.lms.shared.dto.request.account.UpdateStatusRequest;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;

import jakarta.servlet.http.HttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for AccountController
 * Covers UC-03 (Khóa / Mở khóa tài khoản), UC-04 (Cập nhật thông tin cá nhân)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AccountController Tests - Account & Profile Management")
class AccountControllerTest {

    @Mock
    private AccountService accountService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private AccountController accountController;

    private AccountProfileResponse studentProfile;
    private AccountProfileResponse teacherProfile;
    private UpdateProfileRequest updateProfileRequest;

    @BeforeEach
    void setUp() {
        // Setup student profile
        AccountProfileResponse.Profile studentProfileData = AccountProfileResponse.Profile.builder()
                .fullName("John Student")
                .bio("Student bio")
                .phone("0123456789")
                .build();

        studentProfile = AccountProfileResponse.builder()
                .accountId(1L)
                .email("student@example.com")
                .username("student123")
                .role(Role.STUDENT)
                .status(AccountStatus.ACTIVE)
                .profile(studentProfileData)
                .build();

        // Setup teacher profile (not used in most tests, but kept for reference)
        AccountProfileResponse.Profile teacherProfileData = AccountProfileResponse.Profile.builder()
                .fullName("Jane Teacher")
                .build();

        teacherProfile = AccountProfileResponse.builder()
                .accountId(2L)
                .email("teacher@example.com")
                .username("teacher123")
                .role(Role.TEACHER)
                .status(AccountStatus.ACTIVE)
                .profile(teacherProfileData)
                .build();

        // Setup update profile request
        updateProfileRequest = new UpdateProfileRequest();
        updateProfileRequest.setFullName("John Updated");
        updateProfileRequest.setBio("Updated bio");
        updateProfileRequest.setPhone("0987654321");
    }

    // ==================== UC-03: KHÓA / MỞ KHÓA TÀI KHOẢN ====================

    @Nested
    @DisplayName("UC-03: Lock/Unlock Account Tests")
    class LockUnlockAccountTests {

        @Test
        @DisplayName("UC-03.1: Admin khóa tài khoản user (User đang active -> Suspended)")
        void testSuspendAccount_Success() {
            // Arrange
            Long accountId = 1L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("Violation of terms of service");

            AccountProfileResponse suspendedProfile = AccountProfileResponse.builder()
                    .accountId(accountId)
                    .email("student@example.com")
                    .username("student123")
                    .role(Role.STUDENT)
                    .status(AccountStatus.SUSPENDED)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.suspendAccount(eq(accountId), anyString(), anyString()))
                    .thenReturn(suspendedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.suspendAccount(
                    accountId, actionRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).suspendAccount(accountId, "Violation of terms of service", "192.168.1.1");
        }

        @Test
        @DisplayName("UC-03.2: Admin mở khóa tài khoản (User đang suspended -> Active)")
        void testUnlockAccount_Success() {
            // Arrange
            Long accountId = 1L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("Ban period expired");

            AccountProfileResponse unlockedProfile = AccountProfileResponse.builder()
                    .accountId(accountId)
                    .email("student@example.com")
                    .username("student123")
                    .role(Role.STUDENT)
                    .status(AccountStatus.ACTIVE)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.unlockAccount(eq(accountId), anyString(), anyString()))
                    .thenReturn(unlockedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.unlockAccount(
                    accountId, actionRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).unlockAccount(accountId, "Ban period expired", "192.168.1.1");
        }

        @Test
        @DisplayName("UC-03.3: Kiểm tra user bị khóa không thể đăng nhập")
        void testSuspendAccount_UserCannotLogin() {
            // Arrange
            Long accountId = 1L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("Security concern");

            AccountProfileResponse suspendedProfile = AccountProfileResponse.builder()
                    .accountId(accountId)
                    .username("student123")
                    .role(Role.STUDENT)
                    .status(AccountStatus.SUSPENDED)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.suspendAccount(eq(accountId), anyString(), anyString()))
                    .thenReturn(suspendedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.suspendAccount(
                    accountId, actionRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            // The suspended status should prevent login (verified in auth service tests)
            verify(accountService, times(1)).suspendAccount(accountId, "Security concern", "192.168.1.1");
        }

        @Test
        @DisplayName("UC-03.4: Admin cố tình khóa tài khoản Admin khác (Exception)")
        void testSuspendAccount_CannotSuspendAdmin() {
            // Arrange
            Long adminAccountId = 3L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("Test reason");

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.suspendAccount(eq(adminAccountId), anyString(), anyString()))
                    .thenThrow(new InvalidRequestException("Cannot suspend admin account"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> accountController.suspendAccount(adminAccountId, actionRequest, httpServletRequest)
            );

            assertEquals("Cannot suspend admin account", exception.getMessage());
            verify(accountService, times(1)).suspendAccount(adminAccountId, "Test reason", "192.168.1.1");
        }

        @Test
        @DisplayName("UC-03: Khóa tài khoản không tồn tại")
        void testSuspendAccount_AccountNotFound() {
            // Arrange
            Long nonExistentId = 999L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("Test reason");

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.suspendAccount(eq(nonExistentId), anyString(), anyString()))
                    .thenThrow(new ResourceNotFoundException("Account not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> accountController.suspendAccount(nonExistentId, actionRequest, httpServletRequest)
            );

            assertEquals("Account not found", exception.getMessage());
        }

        @Test
        @DisplayName("UC-03: Mở khóa tài khoản không bị khóa")
        void testUnlockAccount_AccountNotSuspended() {
            // Arrange
            Long accountId = 1L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("Test reason");

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.unlockAccount(eq(accountId), anyString(), anyString()))
                    .thenThrow(new InvalidRequestException("Account is not suspended"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> accountController.unlockAccount(accountId, actionRequest, httpServletRequest)
            );

            assertEquals("Account is not suspended", exception.getMessage());
        }

        @Test
        @DisplayName("UC-03: Deactivate tài khoản")
        void testDeactivateAccount_Success() {
            // Arrange
            Long accountId = 1L;
            AccountActionRequest actionRequest = new AccountActionRequest();
            actionRequest.setReason("User requested deactivation");

            AccountProfileResponse deactivatedProfile = AccountProfileResponse.builder()
                    .accountId(accountId)
                    .username("student123")
                    .role(Role.STUDENT)
                    .status(AccountStatus.DEACTIVATED)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.deactivateAccount(eq(accountId), anyString(), anyString()))
                    .thenReturn(deactivatedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.deactivateAccount(
                    accountId, actionRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).deactivateAccount(accountId, "User requested deactivation", "192.168.1.1");
        }

        @Test
        @DisplayName("UC-03: Thay đổi status tài khoản thông qua changeAccountStatus")
        void testChangeAccountStatus_Success() {
            // Arrange
            Long accountId = 1L;
            UpdateStatusRequest statusRequest = new UpdateStatusRequest();
            statusRequest.setStatus(AccountStatus.SUSPENDED);
            statusRequest.setReason("Policy violation");

            AccountProfileResponse updatedProfile = AccountProfileResponse.builder()
                    .accountId(accountId)
                    .username("student123")
                    .role(Role.STUDENT)
                    .status(AccountStatus.SUSPENDED)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.changeAccountStatus(eq(accountId), eq(AccountStatus.SUSPENDED), anyString(), anyString()))
                    .thenReturn(updatedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.changeAccountStatus(
                    accountId, statusRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).changeAccountStatus(
                    accountId, AccountStatus.SUSPENDED, "Policy violation", "192.168.1.1"
            );
        }
    }

    // ==================== UC-04: CẬP NHẬT THÔNG TIN CÁ NHÂN ====================

    @Nested
    @DisplayName("UC-04: Update Profile Tests")
    class UpdateProfileTests {

        @Test
        @DisplayName("UC-04.1: Cập nhật thông tin hợp lệ (Tên, Bio, Ảnh đại diện)")
        void testUpdateProfile_Success() {
            // Arrange
            AccountProfileResponse.Profile updatedProfileData = AccountProfileResponse.Profile.builder()
                    .fullName("John Updated")
                    .bio("Updated bio")
                    .phone("0987654321")
                    .build();

            AccountProfileResponse updatedProfile = AccountProfileResponse.builder()
                    .accountId(1L)
                    .profile(updatedProfileData)
                    .build();

            when(accountService.updateProfile(any(UpdateProfileRequest.class)))
                    .thenReturn(updatedProfile);

            // Act
            ResponseEntity<AccountProfileResponse> response = accountController.updateProfile(updateProfileRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getProfile());
            assertEquals("John Updated", response.getBody().getProfile().getFullName());
            assertEquals("Updated bio", response.getBody().getProfile().getBio());
            assertEquals("0987654321", response.getBody().getProfile().getPhone());
            verify(accountService, times(1)).updateProfile(any(UpdateProfileRequest.class));
        }

        @Test
        @DisplayName("UC-04.2: Cập nhật định dạng sai - SĐT chứa chữ")
        void testUpdateProfile_InvalidPhoneNumber() {
            // Arrange
            UpdateProfileRequest invalidRequest = new UpdateProfileRequest();
            invalidRequest.setFullName("John Student");
            invalidRequest.setPhone("abc123xyz"); // Invalid phone number

            when(accountService.updateProfile(any(UpdateProfileRequest.class)))
                    .thenThrow(new InvalidRequestException("Phone number must contain only digits"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> accountController.updateProfile(invalidRequest)
            );

            assertEquals("Phone number must contain only digits", exception.getMessage());
        }

        @Test
        @DisplayName("UC-04.2: Cập nhật định dạng sai - Email sai định dạng")
        void testUpdateProfile_InvalidEmail() {
            // Arrange
            UpdateProfileRequest invalidRequest = new UpdateProfileRequest();
            invalidRequest.setFullName("John Student");

            // Note: In the actual implementation, email is typically not updated via updateProfile
            // This test assumes validation happens at service layer
            when(accountService.updateProfile(any(UpdateProfileRequest.class)))
                    .thenThrow(new InvalidRequestException("Invalid email format"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> accountController.updateProfile(invalidRequest)
            );

            assertEquals("Invalid email format", exception.getMessage());
        }

        @Test
        @DisplayName("UC-04.3: Kiểm tra hiển thị thông tin sau khi cập nhật")
        void testGetProfile_AfterUpdate() {
            // Arrange
            when(accountService.getProfile()).thenReturn(studentProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.getProfile();

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).getProfile();
        }


        @Test
        @DisplayName("UC-04: Cập nhật profile với tên quá dài")
        void testUpdateProfile_NameTooLong() {
            // Arrange
            UpdateProfileRequest invalidRequest = new UpdateProfileRequest();
            invalidRequest.setFullName("A".repeat(300)); // Very long name

            when(accountService.updateProfile(any(UpdateProfileRequest.class)))
                    .thenThrow(new InvalidRequestException("Full name is too long"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> accountController.updateProfile(invalidRequest)
            );

            assertEquals("Full name is too long", exception.getMessage());
        }

        @Test
        @DisplayName("UC-04: Get profile khi chưa đăng nhập")
        void testGetProfile_NotAuthenticated() {
            // Arrange
            when(accountService.getProfile())
                    .thenThrow(new UnauthorizedException("User not authenticated"));

            // Act & Assert
            UnauthorizedException exception = assertThrows(
                    UnauthorizedException.class,
                    () -> accountController.getProfile()
            );

            assertEquals("User not authenticated", exception.getMessage());
        }

        @Test
        @DisplayName("UC-04: Cập nhật bio với nội dung hợp lệ")
        void testUpdateProfile_UpdateBioOnly() {
            // Arrange
            UpdateProfileRequest bioRequest = new UpdateProfileRequest();
            bioRequest.setBio("This is my new bio description");

            AccountProfileResponse.Profile updatedProfileData = AccountProfileResponse.Profile.builder()
                    .bio("This is my new bio description")
                    .build();

            AccountProfileResponse updatedProfile = AccountProfileResponse.builder()
                    .accountId(1L)
                    .profile(updatedProfileData)
                    .build();

            when(accountService.updateProfile(any(UpdateProfileRequest.class)))
                    .thenReturn(updatedProfile);

            // Act
            ResponseEntity<AccountProfileResponse> response = accountController.updateProfile(bioRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody().getProfile());
            assertEquals("This is my new bio description", response.getBody().getProfile().getBio());
        }
    }

    // ==================== ADDITIONAL ADMIN TESTS ====================

    @Nested
    @DisplayName("Additional Admin Account Management Tests")
    class AdminAccountManagementTests {

        @Test
        @DisplayName("Admin get account by ID - Success")
        void testGetAccountById_Success() {
            // Arrange
            Long accountId = 1L;
            when(accountService.getAccountById(accountId)).thenReturn(studentProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.getAccountById(accountId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).getAccountById(accountId);
        }

        @Test
        @DisplayName("Admin get account by ID - Not found")
        void testGetAccountById_NotFound() {
            // Arrange
            Long nonExistentId = 999L;
            when(accountService.getAccountById(nonExistentId))
                    .thenThrow(new ResourceNotFoundException("Account not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> accountController.getAccountById(nonExistentId)
            );

            assertEquals("Account not found", exception.getMessage());
        }

        @Test
        @DisplayName("Admin delete account - Success")
        void testDeleteAccount_Success() {
            // Arrange
            Long accountId = 1L;
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            doNothing().when(accountService).deleteAccountById(eq(accountId), anyString());

            // Act
            ResponseEntity<Void> response = accountController.deleteAccountById(accountId, httpServletRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            verify(accountService, times(1)).deleteAccountById(accountId, "192.168.1.1");
        }

        @Test
        @DisplayName("Admin approve teacher account - Success")
        void testApproveTeacherAccount_Success() {
            // Arrange
            Long teacherId = 2L;
            AccountProfileResponse approvedProfile = AccountProfileResponse.builder()
                    .accountId(teacherId)
                    .status(AccountStatus.ACTIVE)
                    .role(Role.TEACHER)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.approveTeacherAccount(eq(teacherId), anyString()))
                    .thenReturn(approvedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.approveTeacherAccount(
                    teacherId, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).approveTeacherAccount(teacherId, "192.168.1.1");
        }

        @Test
        @DisplayName("Admin reject teacher account - Success")
        void testRejectTeacherAccount_Success() {
            // Arrange
            Long teacherId = 2L;
            vn.uit.lms.shared.dto.request.account.RejectRequest rejectRequest =
                    new vn.uit.lms.shared.dto.request.account.RejectRequest();
            rejectRequest.setReason("Insufficient qualifications");

            AccountProfileResponse rejectedProfile = AccountProfileResponse.builder()
                    .accountId(teacherId)
                    .status(AccountStatus.REJECTED)
                    .role(Role.TEACHER)
                    .build();

            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(accountService.rejectTeacherAccount(eq(teacherId), anyString(), anyString()))
                    .thenReturn(rejectedProfile);

            // Act
            ResponseEntity<ApiResponse<Object>> response = accountController.rejectTeacherAccount(
                    teacherId, rejectRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(accountService, times(1)).rejectTeacherAccount(
                    teacherId, "Insufficient qualifications", "192.168.1.1"
            );
        }
    }
}

