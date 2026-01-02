package vn.uit.lms.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.EmailVerification;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.EmailVerificationRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.service.event.AccountActivatedEvent;
import vn.uit.lms.service.helper.StudentCodeGenerator;
import vn.uit.lms.service.helper.TeacherCodeGenerator;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.exception.InvalidTokenException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vn.uit.lms.shared.util.TokenHashUtil;

@Service
public class EmailVerificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailVerificationService.class);

    private final EmailVerificationRepository emailVerificationRepository;
    private final StudentCodeGenerator studentCodeGenerator;
    private final TeacherCodeGenerator teacherCodeGenerator;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final AccountRepository accountRepository;
    private final ApplicationEventPublisher eventPublisher;

    public EmailVerificationService(EmailVerificationRepository emailVerificationRepository,
                                    StudentCodeGenerator studentCodeGenerator,
                                    TeacherCodeGenerator teacherCodeGenerator,
                                    TeacherRepository teacherRepository,
                                    StudentRepository studentRepository,
                                    AccountRepository accountRepository,
                                    ApplicationEventPublisher eventPublisher) {
        this.emailVerificationRepository = emailVerificationRepository;
        this.studentCodeGenerator = studentCodeGenerator;
        this.teacherCodeGenerator = teacherCodeGenerator;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Verify the given email token and activate or update account status accordingly.
     *
     * @param rawToken unique verification token sent via email
     * @throws ResourceNotFoundException if token not found
     * @throws vn.uit.lms.shared.exception.InvalidTokenException if token is invalid, expired, or used
     */
    @Transactional
    public void verifyToken(String rawToken) {
        log.info("Start verifying email token: {}", rawToken);

        String hashToken = TokenHashUtil.hashToken(rawToken);

        // Find token
        EmailVerification verification = emailVerificationRepository.findByTokenHash(hashToken)
                .orElseThrow(() -> {
                    log.warn("Token not found: {}", rawToken);
                    return new ResourceNotFoundException("Invalid verification token.");
                });

        // Validate token using domain behavior (throws exception if invalid)
        verification.validateForUse();
        verification.validateTokenType(TokenType.VERIFY_EMAIL);

        // Load associated account
        Account account = verification.getAccount();
        log.debug("Processing verification for account id={}, role={}", account.getId(), account.getRole());

        // Activate or set pending status based on role
        switch (account.getRole()) {
            case STUDENT -> {
                log.info("Activating student account id={}", account.getId());
                account.setStatus(AccountStatus.ACTIVE);

                Student student = new Student();
                student.setAccount(account);
                student.setFullName("User" + account.getId());
                student.setStudentCode(studentCodeGenerator.generate());
                studentRepository.save(student);

                log.info("Student entity created with code={}", student.getStudentCode());
            }
            case TEACHER -> {
                log.info("Marking teacher account as pending approval id={}", account.getId());
                account.setStatus(AccountStatus.PENDING_APPROVAL);

                Teacher teacher = new Teacher();
                teacher.setAccount(account);
                teacher.setFullName("User" + account.getId());
                teacher.setTeacherCode(teacherCodeGenerator.generate());
                teacher.setApproved(false);
                teacherRepository.save(teacher);

                log.info("Teacher entity created with code={}", teacher.getTeacherCode());
            }
            default -> log.warn("Unsupported role during verification: {}", account.getRole());
        }

        // Consume token using domain behavior
        verification.consume();
        emailVerificationRepository.save(verification);
        accountRepository.save(account);

        // Notify user of activation success
        eventPublisher.publishEvent(new AccountActivatedEvent(account));

        log.info("Email verification completed successfully for account id={}", account.getId());
    }

    /**
     * Generate a new email verification token for an account.
     *
     * @param account the account for which to generate the verification
     * @param tokenType the type of verification token
     * @return the generated EmailVerification with plain token available
     */
    @Transactional
    public EmailVerification generateVerificationToken(Account account, TokenType tokenType) {
        return generateVerificationToken(account, tokenType, 30);
    }

    /**
     * Generate a new email verification token with custom expiration.
     *
     * @param account the account for which to generate the verification
     * @param tokenType the type of verification token
     * @param expirationMinutes custom expiration time in minutes
     * @return the generated EmailVerification with plain token available
     */
    @Transactional
    public EmailVerification generateVerificationToken(Account account, TokenType tokenType, long expirationMinutes) {
        EmailVerification verification = EmailVerification.generate(account, tokenType, expirationMinutes);
        return emailVerificationRepository.save(verification);
    }



}
