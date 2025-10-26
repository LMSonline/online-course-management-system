package vn.uit.lms.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.service.AuthService;
import vn.uit.lms.service.EmailVerificationService;
import vn.uit.lms.service.RefreshTokenService;
import vn.uit.lms.shared.dto.request.*;
import vn.uit.lms.shared.dto.response.RegisterResponse;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

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
     * Register a new account and send verification email.
     *
     * @param accountRequest registration payload from client
     * @return created account information
     */
    @PostMapping("/register")
    @ApiMessage("Register new account")
    public ResponseEntity<RegisterResponse> registerAccount(@Valid @RequestBody RegisterRequest accountRequest) {
        log.info("Received registration request for email: {}", accountRequest.getEmail());

        // Convert DTO to entity and hash password before saving
        Account account = AccountMapper.toEntity(accountRequest);
        account.setPasswordHash(this.passwordEncoder.encode(accountRequest.getPassword()));

        // Register account and trigger email verification
        Account accountDB = this.authService.registerAccount(account);
        RegisterResponse response = AccountMapper.toResponse(accountDB);

        log.info("Account registered successfully for username: {}", accountDB.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Verify user's email using verification token.
     *
     * @param token unique verification token sent to user's email
     * @return success message if verification passes
     */
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        log.debug("Verifying email token: {}", token);

        this.emailVerificationService.verifyToken(token);

        log.info("Email verification succeeded for token: {}", token);
        return ResponseEntity.ok("Your email has been successfully verified!");
    }

    /**
     * Authenticate user credentials.
     *
     * @param reqLoginDTO login credentials (username/email + password)
     * @return success message if authentication passes
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
     * Refresh access token using a valid refresh token.
     *
     * @param reqRefreshTokenDTO refresh token request payload
     * @param request HTTP servlet request to extract client IP
     * @return new access token and related authentication info
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
     * Logout user by revoking their refresh token.
     *
     * @param request refresh token to revoke
     * @return HTTP 204 No Content response
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody ReqRefreshTokenDTO request) {
        refreshTokenService.revokeRefreshToken(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        log.info("Received password reset request for email: {}", forgotPasswordDTO.getEmail());

        this.authService.forgotPassword(forgotPasswordDTO.getEmail());

        log.info("Password reset email sent to: {}", forgotPasswordDTO.getEmail());
        return ResponseEntity.ok("If an account with that email exists, a password reset link has been sent.");
    }

    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(
            @RequestParam("token") String token,
            @Valid @RequestBody ResetPasswordDTO resetPasswordDTO
    ) {
        log.info("Received password reset submission for token: {}", token);

        this.authService.resetPassword(token, resetPasswordDTO.getNewPassword());

        log.info("Password reset successful for token: {}", token);
        return ResponseEntity.noContent().build();
    }


    




}
