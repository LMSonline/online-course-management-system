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
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.EmailVerificationService;
import vn.uit.lms.shared.dto.request.RegisterRequest;
import vn.uit.lms.shared.dto.request.ReqLoginDTO;
import vn.uit.lms.shared.dto.response.RegisterResponse;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AccountService accountService;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AccountService accountService,
                          PasswordEncoder passwordEncoder,
                          EmailVerificationService emailVerificationService) {
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
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
        Account accountDB = this.accountService.registerAccount(account);
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

        ResLoginDTO res = this.accountService.login(reqLoginDTO);

        log.info("Login successful for user: {}", reqLoginDTO.getLogin());
        return ResponseEntity.ok(res);
    }
}
