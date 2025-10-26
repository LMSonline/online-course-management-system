package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.EmailVerification;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.EmailVerificationRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.service.helper.StudentCodeGenerator;
import vn.uit.lms.service.helper.TeacherCodeGenerator;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.exception.InvalidTokenException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

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
    private final MailService mailService;

    public EmailVerificationService(EmailVerificationRepository emailVerificationRepository,
                                    StudentCodeGenerator studentCodeGenerator,
                                    TeacherCodeGenerator teacherCodeGenerator,
                                    TeacherRepository teacherRepository,
                                    StudentRepository studentRepository,
                                    AccountRepository accountRepository,
                                    MailService mailService) {
        this.emailVerificationRepository = emailVerificationRepository;
        this.studentCodeGenerator = studentCodeGenerator;
        this.teacherCodeGenerator = teacherCodeGenerator;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.mailService = mailService;
    }

    /**
     * Verify the given email token and activate or update account status accordingly.
     * @param rawToken unique verification token sent via email
     * @throws ResourceNotFoundException if token not found
     * @throws InvalidTokenException     if token is expired, used, or invalid
     */
    @Transactional
    public void verifyToken(String rawToken) {
        log.info("Start verifying email token: {}", rawToken);
        String hashToken = TokenHashUtil.hashToken(rawToken);

        //Validate token existence
        EmailVerification verification = emailVerificationRepository.findByTokenHash(hashToken)
                .orElseThrow(() -> {
                    log.warn("Token not found: {}", rawToken);
                    return new ResourceNotFoundException("Invalid verification token.");
                });

        //Check token usage
        if (verification.isUsed()) {
            log.warn("Token has already been used: {}", rawToken);
            throw new InvalidTokenException("Token has already been used.");
        }

        //Check expiration
        if (verification.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Token expired: {}", rawToken);
            throw new InvalidTokenException("Token has expired.");
        }

        //Validate token type
        if (verification.getTokenType() != TokenType.VERIFY_EMAIL) {
            log.warn("Invalid token type: {}", verification.getTokenType());
            throw new InvalidTokenException("Invalid token type.");
        }

        //Load associated account
        Account account = verification.getAccount();
        log.debug("Processing verification for account id={}, role={}", account.getId(), account.getRole());

        //Activate or set pending status based on role
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

        //Mark token as used and persist all updates
        verification.setUsed(true);
        emailVerificationRepository.save(verification);
        accountRepository.save(account);

        //Notify user of activation success
        mailService.sendActivationSuccessEmail(account);

        log.info("Email verification completed successfully for account id={}", account.getId());
    }


}
