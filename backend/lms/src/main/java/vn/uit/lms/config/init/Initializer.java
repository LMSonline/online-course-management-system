package vn.uit.lms.config.init;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.service.helper.StudentCodeGenerator;
import vn.uit.lms.service.helper.TeacherCodeGenerator;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

/**
 * Initializes default accounts (Admin, Student, Teacher) on application startup.
 *
 * <p>This ensures that at least one admin and demo accounts exist for quick setup
 * after deployment.</p>
 */
@Component
public class Initializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(Initializer.class);

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentCodeGenerator studentCodeGenerator;
    private final TeacherCodeGenerator teacherCodeGenerator;

    @Value("${app.avatar.default-url}")
    private String defaultAvatarUrl;

    @Value("${app.admin.username}") private String adminUsername;
    @Value("${app.admin.email}") private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;

    @Value("${app.student.username}") private String studentUsername;
    @Value("${app.student.email}") private String studentEmail;
    @Value("${app.student.password}") private String studentPassword;

    @Value("${app.teacher.username}") private String teacherUsername;
    @Value("${app.teacher.email}") private String teacherEmail;
    @Value("${app.teacher.password}") private String teacherPassword;

    public Initializer(AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       StudentRepository studentRepository,
                       TeacherRepository teacherRepository,
                       StudentCodeGenerator studentCodeGenerator,
                       TeacherCodeGenerator teacherCodeGenerator) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.studentCodeGenerator = studentCodeGenerator;
        this.teacherCodeGenerator = teacherCodeGenerator;
    }

    @Override
    public void run(String... args) {
        createDefaultAccountIfAbsent(Role.ADMIN, adminUsername, adminEmail, adminPassword);
        createDefaultAccountIfAbsent(Role.STUDENT, studentUsername, studentEmail, studentPassword);
        createDefaultAccountIfAbsent(Role.TEACHER, teacherUsername, teacherEmail, teacherPassword);
    }

    /**
     * Creates a default account if it doesn't already exist.
     */
    private void createDefaultAccountIfAbsent(Role role, String username, String email, String password) {
        if (accountRepository.existsByEmail(email) || accountRepository.existsByUsername(username)) {
            logger.info("[{}] Account already exists. Skipping initialization (email: {})", role, email);
            return;
        }

        Account account = new Account();
        account.setUsername(username);
        account.setEmail(email);
        account.setPasswordHash(passwordEncoder.encode(password));
        account.setRole(role);
        account.setAvatarUrl(defaultAvatarUrl);
        account.setStatus(AccountStatus.ACTIVE);

        accountRepository.save(account);

        // Create role-specific profile
        switch (role) {
            case STUDENT -> createStudentProfile(account);
            case TEACHER -> createTeacherProfile(account);
            case ADMIN -> logger.info("[ADMIN] Admin profile not required.");
        }

        logger.info("[{}] Default account created successfully (username: {}, email: {}).", role, username, email);
    }

    private void createStudentProfile(Account account) {
        Student student = new Student();
        student.setAccount(account);
        student.setFullName("User" + account.getId());
        student.setStudentCode(studentCodeGenerator.generate());
        studentRepository.save(student);
        logger.info("[STUDENT] Profile created for accountId={}", account.getId());
    }

    private void createTeacherProfile(Account account) {
        Teacher teacher = new Teacher();
        teacher.setAccount(account);
        teacher.setApproved(true);
        teacher.setTeacherCode(teacherCodeGenerator.generate());
        teacher.setFullName("User" + account.getId());
        teacherRepository.save(teacher);
        logger.info("[TEACHER] Profile created for accountId={}", account.getId());
    }
}

