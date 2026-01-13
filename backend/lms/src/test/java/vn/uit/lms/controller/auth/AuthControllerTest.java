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
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.service.AuthService;
import vn.uit.lms.service.EmailVerificationService;
import vn.uit.lms.service.RefreshTokenService;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.request.auth.*;
import vn.uit.lms.shared.dto.response.auth.MeResponse;
import vn.uit.lms.shared.dto.response.auth.RegisterResponse;
import vn.uit.lms.shared.dto.response.auth.ResLoginDTO;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Test class for AuthController
 * Covers UC-01 (Đăng ký tài khoản), UC-02 (Đăng nhập), UC-05 (Quên mật khẩu / Reset password)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Tests - Authentication & Account Management")
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest studentRegisterRequest;
    private RegisterRequest teacherRegisterRequest;
    private ReqLoginDTO validLoginRequest;
    private Account studentAccount;
    private Account teacherAccount;
    private ResLoginDTO loginResponse;

    @BeforeEach
    void setUp() {
        // Setup student registration request
        studentRegisterRequest = new RegisterRequest();
        studentRegisterRequest.setEmail("student@example.com");
        studentRegisterRequest.setUsername("student123");
        studentRegisterRequest.setPassword("SecurePass@123");
        studentRegisterRequest.setRole(Role.STUDENT);

        // Setup teacher registration request
        teacherRegisterRequest = new RegisterRequest();
        teacherRegisterRequest.setEmail("teacher@example.com");
        teacherRegisterRequest.setUsername("teacher123");
        teacherRegisterRequest.setPassword("SecurePass@456");
        teacherRegisterRequest.setRole(Role.TEACHER);

        // Setup student account
        studentAccount = new Account();
        studentAccount.setId(1L);
        studentAccount.setEmail("student@example.com");
        studentAccount.setUsername("student123");
        studentAccount.setRole(Role.STUDENT);
        studentAccount.setStatus(AccountStatus.PENDING_EMAIL);

        // Setup teacher account
        teacherAccount = new Account();
        teacherAccount.setId(2L);
        teacherAccount.setEmail("teacher@example.com");
        teacherAccount.setUsername("teacher123");
        teacherAccount.setRole(Role.TEACHER);
        teacherAccount.setStatus(AccountStatus.PENDING_APPROVAL);

        // Setup login request
        validLoginRequest = new ReqLoginDTO();
        validLoginRequest.setLogin("student@example.com");
        validLoginRequest.setPassword("SecurePass@123");

        // Setup login response
        loginResponse = new ResLoginDTO();
        loginResponse.setAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
        loginResponse.setRefreshToken("refresh_token_123");
    }

    // ==================== UC-01: ĐĂNG KÝ TÀI KHOẢN ====================

    @Nested
    @DisplayName("UC-01: Account Registration Tests")
    class AccountRegistrationTests {

        @Test
        @DisplayName("UC-01.1: Đăng ký thành công vai trò Học viên (Email hợp lệ, chưa tồn tại)")
        void testRegisterStudent_Success() {
            // Arrange
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
            when(authService.registerAccount(any(Account.class))).thenReturn(studentAccount);

            // Act
            ResponseEntity<RegisterResponse> response = authController.registerAccount(studentRegisterRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("student@example.com", response.getBody().getEmail());
            assertEquals("student123", response.getBody().getUsername());
            assertEquals(Role.STUDENT, response.getBody().getRole());
            assertEquals(AccountStatus.PENDING_EMAIL, response.getBody().getStatus());

            verify(passwordEncoder, times(1)).encode("SecurePass@123");
            verify(authService, times(1)).registerAccount(any(Account.class));
        }

        @Test
        @DisplayName("UC-01.2: Đăng ký thành công vai trò Giảng viên (Trạng thái Pending)")
        void testRegisterTeacher_Success_PendingApproval() {
            // Arrange
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
            when(authService.registerAccount(any(Account.class))).thenReturn(teacherAccount);

            // Act
            ResponseEntity<RegisterResponse> response = authController.registerAccount(teacherRegisterRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("teacher@example.com", response.getBody().getEmail());
            assertEquals("teacher123", response.getBody().getUsername());
            assertEquals(Role.TEACHER, response.getBody().getRole());
            assertEquals(AccountStatus.PENDING_APPROVAL, response.getBody().getStatus());

            verify(passwordEncoder, times(1)).encode("SecurePass@456");
            verify(authService, times(1)).registerAccount(any(Account.class));
        }

        @Test
        @DisplayName("UC-01.3: Đăng ký thất bại do thiếu thông tin bắt buộc")
        void testRegister_Fail_MissingRequiredFields() {
            // Arrange
            RegisterRequest invalidRequest = new RegisterRequest();
            invalidRequest.setEmail(""); // Email trống
            invalidRequest.setUsername("user123");
            invalidRequest.setPassword("pass123");

            // Mock validation error from service
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
            when(authService.registerAccount(any(Account.class)))
                    .thenThrow(new InvalidRequestException("Email is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.registerAccount(invalidRequest)
            );

            assertEquals("Email is required", exception.getMessage());
        }

        @Test
        @DisplayName("UC-01.4: Đăng ký thất bại do trùng Email")
        void testRegister_Fail_DuplicateEmail() {
            // Arrange
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
            when(authService.registerAccount(any(Account.class)))
                    .thenThrow(new InvalidRequestException("Email already exists"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.registerAccount(studentRegisterRequest)
            );

            assertEquals("Email already exists", exception.getMessage());
            verify(authService, times(1)).registerAccount(any(Account.class));
        }

        @Test
        @DisplayName("UC-01.4: Đăng ký thất bại do trùng Username")
        void testRegister_Fail_DuplicateUsername() {
            // Arrange
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
            when(authService.registerAccount(any(Account.class)))
                    .thenThrow(new InvalidRequestException("Username already exists"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.registerAccount(studentRegisterRequest)
            );

            assertEquals("Username already exists", exception.getMessage());
        }

        @Test
        @DisplayName("UC-01.5: Kiểm tra nhận email xác thực sau khi đăng ký")
        void testRegister_EmailVerificationSent() {
            // Arrange
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
            when(authService.registerAccount(any(Account.class))).thenReturn(studentAccount);
            // Email verification is triggered inside authService.registerAccount

            // Act
            ResponseEntity<RegisterResponse> response = authController.registerAccount(studentRegisterRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertEquals(AccountStatus.PENDING_EMAIL, response.getBody().getStatus());

            // Verify that account is created and email verification should be triggered
            verify(authService, times(1)).registerAccount(any(Account.class));
        }
    }

    // ==================== UC-02: ĐĂNG NHẬP ====================

    @Nested
    @DisplayName("UC-02: Login Tests")
    class LoginTests {

        @Test
        @DisplayName("UC-02.1: Đăng nhập thành công (Đúng user/pass, tài khoản active)")
        void testLogin_Success_ActiveAccount() {
            // Arrange
            studentAccount.setStatus(AccountStatus.ACTIVE);
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class))).thenReturn(loginResponse);

            // Act
            ResponseEntity<ResLoginDTO> response = authController.login(validLoginRequest, httpServletRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getAccessToken());
            assertNotNull(response.getBody().getRefreshToken());
            assertEquals("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", response.getBody().getAccessToken());

            verify(authService, times(1)).login(any(ReqLoginDTO.class));
        }

        @Test
        @DisplayName("UC-02.2: Đăng nhập thất bại (Sai username)")
        void testLogin_Fail_WrongUsername() {
            // Arrange
            ReqLoginDTO wrongLoginRequest = new ReqLoginDTO();
            wrongLoginRequest.setLogin("wronguser@example.com");
            wrongLoginRequest.setPassword("SecurePass@123");

            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class)))
                    .thenThrow(new InvalidRequestException("Invalid username or password"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.login(wrongLoginRequest, httpServletRequest)
            );

            assertEquals("Invalid username or password", exception.getMessage());
            verify(authService, times(1)).login(any(ReqLoginDTO.class));
        }

        @Test
        @DisplayName("UC-02.2: Đăng nhập thất bại (Sai password)")
        void testLogin_Fail_WrongPassword() {
            // Arrange
            ReqLoginDTO wrongPasswordRequest = new ReqLoginDTO();
            wrongPasswordRequest.setLogin("student@example.com");
            wrongPasswordRequest.setPassword("WrongPassword");

            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class)))
                    .thenThrow(new InvalidRequestException("Invalid username or password"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.login(wrongPasswordRequest, httpServletRequest)
            );

            assertEquals("Invalid username or password", exception.getMessage());
        }

        @Test
        @DisplayName("UC-02.3: Đăng nhập thất bại (Tài khoản bị khóa)")
        void testLogin_Fail_AccountSuspended() {
            // Arrange
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class)))
                    .thenThrow(new InvalidRequestException("Account is suspended"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.login(validLoginRequest, httpServletRequest)
            );

            assertEquals("Account is suspended", exception.getMessage());
            verify(authService, times(1)).login(any(ReqLoginDTO.class));
        }

        @Test
        @DisplayName("UC-02.4: Đăng nhập thất bại (Tài khoản Giảng viên chưa được duyệt)")
        void testLogin_Fail_TeacherNotApproved() {
            // Arrange
            ReqLoginDTO teacherLoginRequest = new ReqLoginDTO();
            teacherLoginRequest.setLogin("teacher@example.com");
            teacherLoginRequest.setPassword("SecurePass@456");

            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class)))
                    .thenThrow(new InvalidRequestException("Account is pending approval"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.login(teacherLoginRequest, httpServletRequest)
            );

            assertEquals("Account is pending approval", exception.getMessage());
            verify(authService, times(1)).login(any(ReqLoginDTO.class));
        }

        @Test
        @DisplayName("UC-02.5: Kiểm tra tính năng 'Ghi nhớ đăng nhập' (Refresh Token)")
        void testLogin_RememberMe_RefreshTokenIssued() {
            // Arrange
            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class))).thenReturn(loginResponse);

            // Act
            ResponseEntity<ResLoginDTO> response = authController.login(validLoginRequest, httpServletRequest);

            // Assert
            assertNotNull(response);
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getRefreshToken());
            assertEquals("refresh_token_123", response.getBody().getRefreshToken());

            verify(authService, times(1)).login(any(ReqLoginDTO.class));
        }

        @Test
        @DisplayName("UC-02: Đăng nhập với email thay vì username")
        void testLogin_WithEmail() {
            // Arrange
            ReqLoginDTO emailLoginRequest = new ReqLoginDTO();
            emailLoginRequest.setLogin("student@example.com");
            emailLoginRequest.setPassword("SecurePass@123");

            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(authService.login(any(ReqLoginDTO.class))).thenReturn(loginResponse);

            // Act
            ResponseEntity<ResLoginDTO> response = authController.login(emailLoginRequest, httpServletRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(authService, times(1)).login(any(ReqLoginDTO.class));
        }
    }

    // ==================== UC-05: QUÊN MẬT KHẨU / RESET PASSWORD ====================

    @Nested
    @DisplayName("UC-05: Forgot Password & Reset Password Tests")
    class ForgotPasswordTests {

        @Test
        @DisplayName("UC-05.1: Yêu cầu reset password với email đúng")
        void testForgotPassword_Success_ValidEmail() {
            // Arrange
            ForgotPasswordDTO forgotPasswordDTO = new ForgotPasswordDTO();
            forgotPasswordDTO.setEmail("student@example.com");

            doNothing().when(authService).forgotPassword(anyString());

            // Act
            ResponseEntity<Void> response = authController.forgotPassword(forgotPasswordDTO);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(authService, times(1)).forgotPassword("student@example.com");
        }

        @Test
        @DisplayName("UC-05.2: Yêu cầu reset password với email không tồn tại")
        void testForgotPassword_EmailNotFound() {
            // Arrange
            ForgotPasswordDTO forgotPasswordDTO = new ForgotPasswordDTO();
            forgotPasswordDTO.setEmail("notfound@example.com");

            doThrow(new ResourceNotFoundException("Email not found"))
                    .when(authService).forgotPassword(anyString());

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> authController.forgotPassword(forgotPasswordDTO)
            );

            assertEquals("Email not found", exception.getMessage());
            verify(authService, times(1)).forgotPassword("notfound@example.com");
        }

        @Test
        @DisplayName("UC-05.3: Đặt lại mật khẩu thành công qua token")
        void testResetPassword_Success_ValidToken() {
            // Arrange
            String validToken = "valid_reset_token_123";
            ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO();
            resetPasswordDTO.setNewPassword("NewSecurePass@123");

            doNothing().when(authService).resetPassword(anyString(), anyString());

            // Act
            ResponseEntity<Void> response = authController.resetPassword(validToken, resetPasswordDTO);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(authService, times(1)).resetPassword(validToken, "NewSecurePass@123");
        }

        @Test
        @DisplayName("UC-05.4: Sử dụng token đã hết hạn")
        void testResetPassword_Fail_ExpiredToken() {
            // Arrange
            String expiredToken = "expired_token_123";
            ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO();
            resetPasswordDTO.setNewPassword("NewSecurePass@123");

            doThrow(new InvalidRequestException("Reset token has expired"))
                    .when(authService).resetPassword(anyString(), anyString());

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.resetPassword(expiredToken, resetPasswordDTO)
            );

            assertEquals("Reset token has expired", exception.getMessage());
            verify(authService, times(1)).resetPassword(expiredToken, "NewSecurePass@123");
        }

        @Test
        @DisplayName("UC-05.4: Sử dụng token không hợp lệ")
        void testResetPassword_Fail_InvalidToken() {
            // Arrange
            String invalidToken = "invalid_token_123";
            ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO();
            resetPasswordDTO.setNewPassword("NewSecurePass@123");

            doThrow(new InvalidRequestException("Invalid reset token"))
                    .when(authService).resetPassword(anyString(), anyString());

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.resetPassword(invalidToken, resetPasswordDTO)
            );

            assertEquals("Invalid reset token", exception.getMessage());
        }

        @Test
        @DisplayName("UC-05: Reset password với mật khẩu yếu")
        void testResetPassword_Fail_WeakPassword() {
            // Arrange
            String validToken = "valid_token_123";
            ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO();
            resetPasswordDTO.setNewPassword("123"); // Mật khẩu yếu

            doThrow(new InvalidRequestException("Password does not meet security requirements"))
                    .when(authService).resetPassword(anyString(), anyString());

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.resetPassword(validToken, resetPasswordDTO)
            );

            assertEquals("Password does not meet security requirements", exception.getMessage());
        }
    }

    // ==================== ADDITIONAL TESTS ====================

    @Nested
    @DisplayName("Additional Authentication Tests")
    class AdditionalAuthTests {

        @Test
        @DisplayName("Verify email - Success")
        void testVerifyEmail_Success() {
            // Arrange
            String validToken = "valid_email_token_123";
            doNothing().when(emailVerificationService).verifyToken(anyString());

            // Act
            ResponseEntity<Void> response = authController.verifyEmail(validToken);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(emailVerificationService, times(1)).verifyToken(validToken);
        }

        @Test
        @DisplayName("Verify email - Invalid token")
        void testVerifyEmail_InvalidToken() {
            // Arrange
            String invalidToken = "invalid_token";
            doThrow(new InvalidRequestException("Invalid verification token"))
                    .when(emailVerificationService).verifyToken(anyString());

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> authController.verifyEmail(invalidToken)
            );

            assertEquals("Invalid verification token", exception.getMessage());
        }

        @Test
        @DisplayName("Refresh access token - Success")
        void testRefreshToken_Success() {
            // Arrange
            ReqRefreshTokenDTO refreshTokenRequest = new ReqRefreshTokenDTO();
            refreshTokenRequest.setRefreshToken("valid_refresh_token");

            when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(httpServletRequest.getRemoteAddr()).thenReturn("192.168.1.1");
            when(refreshTokenService.refreshAccessToken(any(ReqRefreshTokenDTO.class)))
                    .thenReturn(loginResponse);

            // Act
            ResponseEntity<ResLoginDTO> response = authController.refreshAccessToken(
                    refreshTokenRequest, httpServletRequest
            );

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getAccessToken());
            verify(refreshTokenService, times(1)).refreshAccessToken(any(ReqRefreshTokenDTO.class));
        }

        @Test
        @DisplayName("Logout - Success")
        void testLogout_Success() {
            // Arrange
            ReqRefreshTokenDTO logoutRequest = new ReqRefreshTokenDTO();
            logoutRequest.setRefreshToken("valid_refresh_token");

            doNothing().when(refreshTokenService).revokeRefreshToken(anyString());

            // Act
            ResponseEntity<Void> response = authController.logout(logoutRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(refreshTokenService, times(1)).revokeRefreshToken("valid_refresh_token");
        }

        @Test
        @DisplayName("Get current user info - Success")
        void testGetCurrentUserInfo_Success() {
            // Arrange
            MeResponse meResponse = new MeResponse();
            meResponse.setAccountId(1L);
            meResponse.setEmail("student@example.com");
            meResponse.setUsername("student123");
            meResponse.setRole(Role.STUDENT);

            when(authService.getCurrentUserInfo()).thenReturn(meResponse);

            // Act
            ResponseEntity<MeResponse> response = authController.getCurrentUserInfo();

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("student@example.com", response.getBody().getEmail());
            assertEquals(Role.STUDENT, response.getBody().getRole());
            verify(authService, times(1)).getCurrentUserInfo();
        }
    }
}

