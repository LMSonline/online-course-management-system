package vn.uit.lms.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.service.AuthService;
import vn.uit.lms.service.EmailVerificationService;
import vn.uit.lms.service.RefreshTokenService;
import vn.uit.lms.shared.dto.request.*;
import vn.uit.lms.shared.dto.response.MeResponse;
import vn.uit.lms.shared.dto.response.RegisterResponse;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.annotation.ApiMessage;

/**
 * Authentication and authorization controller for user account operations.
 *
 * Handles registration, login, password management, and email verification.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Value("${app.avatar.default-url}")
    private String defaultAvatarUrl;

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService authService,
                          PasswordEncoder passwordEncoder,
                          EmailVerificationService emailVerificationService,
                          RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * Register a new account (Student/Teacher) and trigger verification email.
     *
     * @param accountRequest registration payload containing email, username, and password
     * @return newly created account information
     */
    @PostMapping("/register")
    @ApiMessage("Register new account")
    public ResponseEntity<RegisterResponse> registerAccount(@Valid @RequestBody RegisterRequest accountRequest) {
        log.info("Received registration request for email: {}", accountRequest.getEmail());

        Account account = AccountMapper.toEntity(accountRequest);
        account.setAvatarUrl(defaultAvatarUrl);
        account.setPasswordHash(this.passwordEncoder.encode(accountRequest.getPassword()));

        Account accountDB = this.authService.registerAccount(account);
        RegisterResponse response = AccountMapper.toResponse(accountDB);

        log.info("Account registered successfully for username: {}", accountDB.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Verify a user's email using a verification token sent to their email.
     *
     * @param token unique verification token
     * @return confirmation message if verification is successful
     */
    @GetMapping("/verify-email")
    @ApiMessage("Verify user email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        log.debug("Verifying email token: {}", token);
        this.emailVerificationService.verifyToken(token);
        log.info("Email verification succeeded for token: {}", token);
        return ResponseEntity.ok(null);
    }

    /**
     * Authenticate a user's login credentials and issue JWT + refresh token.
     *
     * @param reqLoginDTO login credentials (username/email + password)
     * @param request HTTP request (used to extract client IP)
     * @return login response containing tokens and account info
     */
    @PostMapping("/login")
    @ApiMessage("Login to the system")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO reqLoginDTO, HttpServletRequest request) {
        log.info("Login attempt for user: {}", reqLoginDTO.getLogin());

        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null) clientIp = request.getRemoteAddr();

        reqLoginDTO.setIpAddress(clientIp);
        ResLoginDTO res = this.authService.login(reqLoginDTO);

        log.info("Login successful for user: {}", reqLoginDTO.getLogin());
        return ResponseEntity.ok(res);
    }

    /**
     * Generate a new access token using a valid refresh token.
     *
     * @param reqRefreshTokenDTO payload containing the refresh token
     * @param request HTTP request (used to extract client IP)
     * @return new access token + refresh token pair
     */
    @PostMapping("/refresh")
    @ApiMessage("Refresh access token using refresh token")
    public ResponseEntity<ResLoginDTO> refreshAccessToken(@Valid @RequestBody ReqRefreshTokenDTO reqRefreshTokenDTO, HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null) clientIp = request.getRemoteAddr();

        reqRefreshTokenDTO.setIpAddress(clientIp);
        ResLoginDTO response = refreshTokenService.refreshAccessToken(reqRefreshTokenDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Revoke the user's refresh token to log out of the system.
     *
     * @param request payload containing the refresh token to revoke
     * @return 204 No Content if logout is successful
     */
    @PostMapping("/logout")
    @ApiMessage("Logout and revoke refresh token")
    public ResponseEntity<Void> logout(@Valid @RequestBody ReqRefreshTokenDTO request) {
        refreshTokenService.revokeRefreshToken(request.getRefreshToken());
        return ResponseEntity.ok(null);
    }

    /**
     * Request password reset by email. Sends a password reset link to the user's email.
     *
     * @param forgotPasswordDTO payload containing user email
     * @return message confirming that reset email has been sent (if account exists)
     */
    @PostMapping("/password/forgot")
    @ApiMessage("Request password reset via email")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        log.info("Received password reset request for email: {}", forgotPasswordDTO.getEmail());
        this.authService.forgotPassword(forgotPasswordDTO.getEmail());
        log.info("Password reset email sent to: {}", forgotPasswordDTO.getEmail());
        return ResponseEntity.ok(null);
    }

    /**
     * Reset user password using a valid token from the reset email.
     *
     * @param token password reset token
     * @param resetPasswordDTO payload containing the new password
     * @return 204 No Content if password reset is successful
     */
    @PostMapping("/password/reset")
    @ApiMessage("Reset password using reset token")
    public ResponseEntity<Void> resetPassword(
            @RequestParam("token") String token,
            @Valid @RequestBody ResetPasswordDTO resetPasswordDTO
    ) {
        log.info("Received password reset submission for token: {}", token);
        this.authService.resetPassword(token, resetPasswordDTO.getNewPassword());
        log.info("Password reset successful for token: {}", token);
        return ResponseEntity.ok(null);
    }

    /**
     * Retrieve information about the currently logged-in user.
     *
     * @return user information of the currently authenticated account
     */
    @GetMapping("/me")
    @ApiMessage("Get current logged-in user info")
    public ResponseEntity<MeResponse> getCurrentUserInfo() {
        MeResponse userInfo = authService.getCurrentUserInfo();
        return ResponseEntity.ok(userInfo);
    }

    /**
     * Change password for a logged-in user using the old password.
     *
     * @param changePasswordDTO payload containing old and new passwords
     * @return 204 No Content if password change is successful
     */
    @PutMapping("/password/change")
    @ApiMessage("Change password for logged-in user")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        log.info("Received password change request for user");
        this.authService.changePassword(changePasswordDTO);
        log.info("Password change successful for user");
        return ResponseEntity.ok(null);
    }
}
