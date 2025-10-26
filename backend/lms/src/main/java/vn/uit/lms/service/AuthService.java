package vn.uit.lms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.*;
import vn.uit.lms.core.repository.*;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.dto.request.ReqLoginDTO;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
import vn.uit.lms.shared.exception.*;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.TokenHashUtil;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Service class for managing user accounts, authentication, and registration.
 * <p>
 * Handles registration, login, token generation, and account verification processes.
 * Integrates with Spring Security for authentication and with email service for activation.
 * </p>
 */
@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final MailService emailService;
    private final EmailVerificationRepository emailVerificationRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtils securityUtils;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);


    /**
     * Constructs an {@code AuthService} with all required dependencies.
     */
    public AuthService(AccountRepository accountRepository,
                       MailService emailService,
                       EmailVerificationRepository emailVerificationRepository,
                       AuthenticationManagerBuilder authenticationManagerBuilder,
                       SecurityUtils securityUtils,
                       StudentRepository studentRepository,
                       TeacherRepository teacherRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.emailVerificationRepository = emailVerificationRepository;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtils = securityUtils;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new account and sends an email verification link.
     * <p>
     * - Checks for duplicate username or email.
     * - Deletes non-activated accounts with same credentials.
     * - Saves the account in {@code PENDING_EMAIL} status and sends verification mail.
     * </p>
     *
     * @param account the account entity to register
     * @return the saved {@link Account} entity
     * @throws UsernameAlreadyUsedException if the username is already used
     * @throws EmailAlreadyUsedException if the email is already used
     */
    @Transactional
    public Account registerAccount(Account account) {

        accountRepository.findOneByUsername(account.getUsername())
                .ifPresent(existingAccount -> {
                    boolean removed = removeNonActivatedAccount(existingAccount);
                    if (!removed) {
                        throw new UsernameAlreadyUsedException();
                    }
                });

        accountRepository.findOneByEmailIgnoreCase(account.getEmail())
                .ifPresent(existingAccount -> {
                    boolean removed = removeNonActivatedAccount(existingAccount);
                    if (!removed) {
                        throw new EmailAlreadyUsedException();
                    }
                });

        account.setStatus(AccountStatus.PENDING_EMAIL);

        Account saved = accountRepository.save(account);

        String rawToken = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.MINUTES);
        String hashedToken = TokenHashUtil.hashToken(rawToken);

        EmailVerification verification = EmailVerification.builder()
                .account(saved)
                .tokenHash(hashedToken)
                .tokenType(TokenType.VERIFY_EMAIL)
                .expiresAt(expiresAt)
                .isUsed(false)
                .build();

        emailVerificationRepository.save(verification);

        // Send activation email
        emailService.sendActivationEmail(saved, rawToken);

        return saved;
    }

    /**
     * Removes an account if it is pending email verification.
     *
     * @param existingAccount the account to check
     * @return {@code true} if removed, {@code false} otherwise
     */
    public boolean removeNonActivatedAccount(Account existingAccount) {
        if (existingAccount.getStatus() == AccountStatus.PENDING_EMAIL) {
            accountRepository.delete(existingAccount);
            accountRepository.flush();
            return true;
        }
        return false;
    }

    /**
     * Authenticates a user and generates access and refresh tokens.
     * <p>
     * - Authenticates credentials via Spring Security.
     * - Builds response with account info and tokens.
     * - Stores hashed refresh token in database.
     * </p>
     *
     * @param reqLoginDTO the login request containing credentials and device info
     * @return a {@link ResLoginDTO} with authentication details and tokens
     * @throws ResourceNotFoundException if the account does not exist
     * @throws UserNotActivatedException if the account is not yet activated
     */
    public ResLoginDTO login(ReqLoginDTO reqLoginDTO) {

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(reqLoginDTO.getLogin(), reqLoginDTO.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO resLoginDTO = new ResLoginDTO();
        Account accountDB = accountRepository.findOneByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Map account to response DTO depending on role
        if(accountDB.getRole() == Role.STUDENT) {

            Student student = studentRepository.findByAccount(accountDB).orElseThrow(
                    () -> new UserNotActivatedException("Account not activated"));

            resLoginDTO = AccountMapper.studentToResLoginDTO(student);
        } else if(accountDB.getRole() == Role.TEACHER) {
            Teacher teacher = teacherRepository.findByAccount(accountDB).orElseThrow(
                    () -> new UserNotActivatedException("Account not activated"));

            resLoginDTO = AccountMapper.teacherToResLoginDTO(teacher);
        }

        // Generate access token
        String accessToken = securityUtils.createAccessToken(authentication.getName(), resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);
        Instant now = Instant.now();
        resLoginDTO.setAccessTokenExpiresAt(now.plus(securityUtils.getAccessTokenExpiration(), ChronoUnit.SECONDS));

        // Generate and save refresh token
        String rawRefreshToken = securityUtils.createRefreshToken(accountDB.getEmail());
        String hashedRefreshToken = TokenHashUtil.hashToken(rawRefreshToken);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setAccount(accountDB);
        refreshToken.setTokenHash(hashedRefreshToken);
        refreshToken.setIpAddress(reqLoginDTO.getIpAddress());
        refreshToken.setDeviceInfo(reqLoginDTO.getDeviceInfo()!=null? reqLoginDTO.getDeviceInfo() : "Unknown device");
        refreshToken.setExpiresAt(now.plus(securityUtils.getRefreshTokenExpiration(), ChronoUnit.SECONDS));

        refreshTokenRepository.save(refreshToken);

        resLoginDTO.setRefreshToken(rawRefreshToken);
        resLoginDTO.setRefreshTokenExpiresAt(refreshToken.getExpiresAt());

        return resLoginDTO;
    }

    public void forgotPassword(String email) {

        Account accountDB = this.accountRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Forgot password failed: email not found [{}]", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });

        String rawToken = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.MINUTES);
        String hashedToken = TokenHashUtil.hashToken(rawToken);

        EmailVerification verification = EmailVerification.builder()
                .account(accountDB)
                .tokenHash(hashedToken)
                .tokenType(TokenType.RESET_PASSWORD)
                .expiresAt(expiresAt)
                .isUsed(false)
                .build();

        emailVerificationRepository.save(verification);

        // Send reset password email
        emailService.sendPasswordResetMail(accountDB, rawToken);
    }

    public void resetPassword(String token, String newPassword) {
        log.info("Start resetting password with token: {}", token);
        String hashToken = TokenHashUtil.hashToken(token);

        // Validate token existence
        EmailVerification verification = emailVerificationRepository.findByTokenHash(hashToken)
                .orElseThrow(() -> {
                    log.warn("Token not found: {}", token);
                    return new InvalidTokenException("Invalid token.");
                });

        // Check token usage
        if (verification.isUsed()) {
            log.warn("Token has already been used: {}", token);
            throw new InvalidTokenException("Token has already been used.");
        }

        // Check expiration
        if (verification.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Token expired: {}", token);
            throw new InvalidTokenException("Token has expired.");
        }

        // Validate token type
        if (verification.getTokenType() != TokenType.RESET_PASSWORD) {
            log.warn("Invalid token type: {}", verification.getTokenType());
            throw new InvalidTokenException("Invalid token type.");
        }

        // Load associated account
        Account account = verification.getAccount();
        log.debug("Resetting password for account id={}, role={}", account.getId(), account.getRole());

        // Update password
        account.setPasswordHash(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        // Mark token as used
        verification.setUsed(true);
        emailVerificationRepository.save(verification);

        log.info("Password reset successfully for account id={}", account.getId());

    }


}
