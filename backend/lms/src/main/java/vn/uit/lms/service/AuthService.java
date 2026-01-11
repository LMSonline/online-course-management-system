package vn.uit.lms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.*;
import vn.uit.lms.core.repository.*;
import vn.uit.lms.service.event.AccountActiveEvent;
import vn.uit.lms.service.event.PasswordResetEvent;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.dto.request.auth.ChangePasswordDTO;
import vn.uit.lms.shared.dto.request.auth.ReqLoginDTO;
import vn.uit.lms.shared.dto.response.auth.MeResponse;
import vn.uit.lms.shared.dto.response.auth.ResLoginDTO;
import vn.uit.lms.shared.exception.*;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.TokenHashUtil;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * AuthService - Thin orchestrator following Rich Domain Model pattern
 * <p>
 * This service coordinates authentication workflows and delegates business logic to domain entities.
 * Domain entities (Account, EmailVerification, Teacher, Student) encapsulate their own behavior.
 * </p>
 */
@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final MailService emailService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtils securityUtils;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final RefreshTokenService refreshTokenService;
    private final EmailVerificationService emailVerificationService;
    private final EmailVerificationRepository emailVerificationRepository;

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);


    /**
     * Constructs an {@code AuthService} with all required dependencies.
     */
    public AuthService(AccountRepository accountRepository,
                       MailService emailService,
                       AuthenticationManagerBuilder authenticationManagerBuilder,
                       SecurityUtils securityUtils,
                       StudentRepository studentRepository,
                       TeacherRepository teacherRepository,
                       PasswordEncoder passwordEncoder,
                       ApplicationEventPublisher eventPublisher,
                       RefreshTokenService refreshTokenService,
                       EmailVerificationService emailVerificationService,
                       EmailVerificationRepository emailVerificationRepository) {
        this.emailVerificationRepository = emailVerificationRepository;
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtils = securityUtils;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
        this.refreshTokenService = refreshTokenService;
        this.emailVerificationService = emailVerificationService;
    }

    /**
     * Registers a new account and sends an email verification link.
     * <p>
     * Service orchestrates: duplicate check, deletion, save, token creation, email event
     * Business logic is in the Account entity
     * </p>
     *
     * @param account the account entity to register
     * @return the saved {@link Account} entity
     * @throws UsernameAlreadyUsedException if the username is already used
     * @throws EmailAlreadyUsedException if the email is already used
     */
    @Transactional
    @EnableSoftDeleteFilter
    public Account registerAccount(Account account) {

        // Check for duplicate username
        accountRepository.findOneByUsername(account.getUsername())
                .ifPresent(existingAccount -> {
                    if (!existingAccount.isPendingEmailVerification()) {
                        throw new UsernameAlreadyUsedException();
                    }
                    accountRepository.delete(existingAccount);
                    accountRepository.flush();
                });

        // Check for duplicate email
        accountRepository.findOneByEmailIgnoreCase(account.getEmail())
                .ifPresent(existingAccount -> {
                    if (!existingAccount.isPendingEmailVerification()) {
                        throw new EmailAlreadyUsedException();
                    }
                    accountRepository.delete(existingAccount);
                    accountRepository.flush();
                });

        // Save account (entity manages its own status)
        Account saved = accountRepository.save(account);

        EmailVerification emailVerification = emailVerificationService.generateVerificationToken(saved, TokenType.VERIFY_EMAIL);
        String rawToken = emailVerification.getPlainToken();

        // Publish event for email sending
        eventPublisher.publishEvent(new AccountActiveEvent(saved, rawToken));

        return saved;
    }

    /**
     * Authenticates a user and generates access and refresh tokens.
     * <p>
     * Service orchestrates: authentication, token generation, DB updates, event publishing
     * Business logic for status management is in Account entity
     * </p>
     *
     * @param reqLoginDTO the login request containing credentials and device info
     * @return a {@link ResLoginDTO} with authentication details and tokens
     * @throws ResourceNotFoundException if the account does not exist
     * @throws UserNotActivatedException if the account is not yet activated
     */
    @EnableSoftDeleteFilter
    public ResLoginDTO login(ReqLoginDTO reqLoginDTO) {

        // Authenticate credentials
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(reqLoginDTO.getLogin(), reqLoginDTO.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Fetch account
        String email = authentication.getName();
        Account accountDB = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Map account to response DTO depending on role
        ResLoginDTO resLoginDTO;
        switch (accountDB.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(accountDB)
                        .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
                resLoginDTO = AccountMapper.studentToResLoginDTO(student);
            }

            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(accountDB)
                        .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
                resLoginDTO = AccountMapper.teacherToResLoginDTO(teacher);
            }

            case ADMIN -> {
                resLoginDTO = AccountMapper.adminToResLoginDTO(accountDB);
            }

            default -> throw new IllegalStateException("Unexpected role: " + accountDB.getRole());
        }

        // Generate access token
        String accessToken = securityUtils.createAccessToken(authentication.getName(), resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);
        Instant now = Instant.now();
        resLoginDTO.setAccessTokenExpiresAt(now.plus(securityUtils.getAccessTokenExpiration(), ChronoUnit.SECONDS));

        // Generate and save refresh token
        String rawRefreshToken = securityUtils.createRefreshToken(accountDB.getEmail());

        RefreshToken refreshToken = refreshTokenService.issueRefreshToken(
                            accountDB,
                            rawRefreshToken,
                            reqLoginDTO.getDeviceInfo(),
                            reqLoginDTO.getIpAddress()
                   );

        resLoginDTO.setRefreshToken(rawRefreshToken);
        resLoginDTO.setRefreshTokenExpiresAt(refreshToken.getExpiresAt());

        // Update last login (using domain behavior)
        accountDB.recordLogin();
        accountRepository.save(accountDB);

        return resLoginDTO;
    }

    @EnableSoftDeleteFilter
    public void forgotPassword(String email) {

        Account accountDB = this.accountRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Forgot password failed: email not found [{}]", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });

        // Create password reset token
        EmailVerification verification = emailVerificationService.generateVerificationToken(accountDB, TokenType.RESET_PASSWORD);
        String rawToken = verification.getPlainToken();

        // Publish event for email sending
        eventPublisher.publishEvent(new PasswordResetEvent(accountDB, rawToken));
    }

    @Transactional
    @EnableSoftDeleteFilter
    public void resetPassword(String token, String newPassword) {
        log.info("Start resetting password with token: {}", token);
        String hashToken = TokenHashUtil.hashToken(token);

        // Find and validate token
        EmailVerification verification = emailVerificationRepository.findByTokenHash(hashToken)
                .orElseThrow(() -> {
                    log.warn("Token not found: {}", token);
                    return new InvalidTokenException("Invalid token.");
                });

        // Validate token using domain behavior
        verification.validateForUse();
        verification.validateTokenType(TokenType.RESET_PASSWORD);

        // Get account and reset password using domain behavior
        Account account = verification.getAccount();
        log.debug("Resetting password for account id={}, role={}", account.getId(), account.getRole());

        account.resetPassword(newPassword, passwordEncoder);
        accountRepository.save(account);

        // Consume token using domain behavior
        verification.consume();
        emailVerificationRepository.save(verification);

        log.info("Password reset successfully for account id={}", account.getId());
    }

    @EnableSoftDeleteFilter
    public MeResponse getCurrentUserInfo() {
        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        MeResponse meResponse = buildBaseResponse(account);

        // Fetch profile based on role
        BaseProfile profile = switch (account.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(account)
                        .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
                yield student;
            }
            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(account)
                        .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
                yield teacher;
            }
            default -> null;
        };

        if (profile != null) {
            fillUserProfile(meResponse, profile);
        }

        return meResponse;
    }

    private MeResponse buildBaseResponse(Account account) {
        return MeResponse.builder()
                .accountId(account.getId())
                .username(account.getUsername())
                .email(account.getEmail())
                .role(account.getRole())
                .avatarUrl(account.getAvatarUrl())
                .lastLoginAt(account.getLastLoginAt())
                .status(account.getStatus())
                .build();
    }

    private void fillUserProfile(MeResponse meResponse, BaseProfile profile) {
        meResponse.setFullName(profile.getFullName());
        meResponse.setGender(profile.getGender());
        meResponse.setBio(profile.getBio());
        meResponse.setBirthday(profile.getBirthDate());
    }

    @Transactional
    @EnableSoftDeleteFilter
    public void changePassword(ChangePasswordDTO changePasswordDTO) {

        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Use domain behavior for password change with validation
        account.changePassword(
                changePasswordDTO.getOldPassword(),
                changePasswordDTO.getNewPassword(),
                passwordEncoder
        );

        accountRepository.save(account);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public void resendVerificationEmail(String email) {
        Account accountDB = this.accountRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Resend verification email failed: email not found [{}]", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });

        // Use domain behavior to check status
        if (!accountDB.isPendingEmailVerification()) {
            log.warn("Resend verification email failed: account already activated [{}]", email);
            throw new IllegalStateException("Account is already activated.");
        }

        // Rate limiting check
        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        long recentAttempts = emailVerificationRepository.countByAccountAndCreatedAtAfterAndTokenType(
                accountDB,
                oneHourAgo,
                TokenType.VERIFY_EMAIL
        );

        if (recentAttempts >= 3) {
            log.warn("Too many resend attempts for email: {}", email);
            throw new TooManyRequestsException("Too many resend attempts. Please try again later.");
        }

        // Generate new verification token using domain behavior
        EmailVerification verification = emailVerificationService.generateVerificationToken(
                accountDB,
                TokenType.VERIFY_EMAIL
        );

        // Publish event for email sending with plain token
        eventPublisher.publishEvent(new AccountActiveEvent(accountDB, verification.getPlainToken()));

        log.info("Verification email resent to: {}", email);
    }



}
