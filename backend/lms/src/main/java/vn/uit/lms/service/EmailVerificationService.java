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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);

    private final EmailVerificationRepository emailVerificationRepository;
    private final StudentCodeGenerator studentCodeGenerator;
    private final TeacherCodeGenerator teacherCodeGenerator;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final AccountRepository accountRepository;

    public EmailVerificationService(EmailVerificationRepository emailVerificationRepository,
                                    StudentCodeGenerator studentCodeGenerator,
                                    TeacherCodeGenerator teacherCodeGenerator,
                                    TeacherRepository teacherRepository,
                                    StudentRepository studentRepository,
                                    AccountRepository accountRepository) {
        this.emailVerificationRepository = emailVerificationRepository;
        this.studentCodeGenerator = studentCodeGenerator;
        this.teacherCodeGenerator = teacherCodeGenerator;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
    }

    /**
     * Xác thực token email và kích hoạt tài khoản tương ứng.
     * - Nếu tài khoản là STUDENT: kích hoạt và tạo bản ghi Student.
     * - Nếu tài khoản là TEACHER: chuyển sang trạng thái chờ duyệt và tạo bản ghi Teacher.
     *
     * @param token mã token xác thực email
     */
    @Transactional
    public void verifyToken(String token) {
        logger.info("Start verifying email token: {}", token);

        //Tìm token trong cơ sở dữ liệu
        EmailVerification verification = emailVerificationRepository
                .findByToken(token)
                .orElseThrow(() -> {
                    logger.warn("Token not found: {}", token);
                    return new ResourceNotFoundException("Invalid verification token.");
                });

        //Kiểm tra token đã được sử dụng hay chưa
        if (verification.isUsed()) {
            logger.warn("Token has already been used: {}", token);
            throw new InvalidTokenException("Token has already been used.");
        }

        //Kiểm tra token còn hạn hay không
        if (verification.getExpiresAt().isBefore(Instant.now())) {
            logger.warn("Token expired: {}", token);
            throw new InvalidTokenException("Token has expired.");
        }

        if (verification.getTokenType() != TokenType.VERIFY_EMAIL) {
            logger.warn("Invalid token type for token: {}", token);
            throw new InvalidTokenException("Invalid token .");
        }

        //Lấy thông tin tài khoản gắn với token
        Account account = verification.getAccount();
        logger.debug("Verifying account id={}, role={}", account.getId(), account.getRole());

        //Kích hoạt hoặc xử lý tài khoản tùy theo vai trò
        if (account.getRole() == Role.STUDENT) {
            logger.info("Activating student account id={}", account.getId());
            account.setStatus(AccountStatus.ACTIVE);

            Student student = new Student();
            student.setAccount(account);
            student.setFullName("User" + account.getId());
            student.setStudentCode(studentCodeGenerator.generate());
            studentRepository.save(student);

            logger.info("Student created with code={}", student.getStudentCode());

        } else if (account.getRole() == Role.TEACHER) {
            logger.info("Marking teacher account pending approval id={}", account.getId());
            account.setStatus(AccountStatus.PENDING_APPROVAL);

            Teacher teacher = new Teacher();
            teacher.setAccount(account);
            teacher.setFullName("User" + account.getId());
            teacher.setTeacherCode(teacherCodeGenerator.generate());
            teacher.setApproved(false);
            teacherRepository.save(teacher);

            logger.info("Teacher created with code={}", teacher.getTeacherCode());
        } else {
            logger.warn("Unsupported role during verification: {}", account.getRole());
        }

        //Đánh dấu token đã sử dụng
        verification.setUsed(true);
        emailVerificationRepository.save(verification);

        //Lưu lại thay đổi của tài khoản
        accountRepository.save(account);

        logger.info("Email verification completed successfully for account id={}", account.getId());
    }
}

