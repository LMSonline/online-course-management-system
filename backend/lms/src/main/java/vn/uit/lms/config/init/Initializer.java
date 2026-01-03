package vn.uit.lms.config.init;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.course.Category;
import vn.uit.lms.core.domain.course.Tag;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.course.CategoryRepository;
import vn.uit.lms.core.repository.course.TagRepository;
import vn.uit.lms.service.helper.StudentCodeGenerator;
import vn.uit.lms.service.helper.TeacherCodeGenerator;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.util.Arrays;
import java.util.List;

/**
 * Initializes default accounts (Admin, Student, Teacher) on application startup.
 *
 * <p>This ensures that at least one admin and demo accounts exist for quick setup
 * after deployment.</p>
 */
@Order(1)
@Component
public class Initializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(Initializer.class);

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentCodeGenerator studentCodeGenerator;
    private final TeacherCodeGenerator teacherCodeGenerator;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

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
                       TeacherCodeGenerator teacherCodeGenerator,
                       TagRepository tagRepository,
                       CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
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
//        if (tagRepository.count() == 0) {
//            createDefaultTags();
//        } else {
//            logger.info("[TAG] Tags already exist. Skipping initialization.");
//        }
//
//        if (categoryRepository.count() == 0) {
//            createDefaultCategories();
//        } else {
//            logger.info("[CATEGORY] Categories already exist. Skipping initialization.");
//        }
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

    private void createDefaultTags() {
        List<String> tagNames = Arrays.asList(
                "Java", "Python", "C++", "Web Development", "Mobile Development",
                "Data Science", "Machine Learning", "AI", "UI/UX", "Design",
                "Marketing", "Business", "Finance", "Photography", "Music",
                "Health", "Fitness", "Languages", "Personal Development", "Cloud Computing"
        );

        for (String name : tagNames) {
            Tag tag = new Tag();
            tag.setName(name);
            tagRepository.save(tag);
            logger.info("[TAG] Created default tag: {}", name);
        }
    }

    private void createDefaultCategories() {
        // Root categories
        List<String> rootNames = Arrays.asList(
                "Development", "Business", "Finance & Accounting", "IT & Software",
                "Office Productivity", "Personal Development", "Design", "Marketing",
                "Lifestyle", "Photography & Video"
        );

        for (String rootName : rootNames) {
            Category root = new Category();
            root.setName(rootName);
            root.setVisible(true);
            categoryRepository.save(root);
            logger.info("[CATEGORY] Created root category: {}", rootName);

            // Tạo các category con
            createSubCategories(root);
        }
    }

    private void createSubCategories(Category root) {
        List<String> subNames;

        switch (root.getName()) {
            case "Development" -> subNames = Arrays.asList(
                    "Web Development", "Mobile Development", "Game Development", "Programming Languages",
                    "Software Testing", "Software Engineering", "Development Tools", "Databases"
            );
            case "Business" -> subNames = Arrays.asList(
                    "Entrepreneurship", "Management", "Sales", "Strategy",
                    "Operations", "Business Analytics", "Communication", "Leadership"
            );
            case "Finance & Accounting" -> subNames = Arrays.asList(
                    "Accounting & Bookkeeping", "Investment", "Finance Fundamentals",
                    "Cryptocurrency", "Trading", "Taxation"
            );
            case "IT & Software" -> subNames = Arrays.asList(
                    "Network & Security", "Hardware", "Operating Systems", "Databases",
                    "Cloud Computing", "IT Certifications", "System Administration"
            );
            case "Office Productivity" -> subNames = Arrays.asList(
                    "Microsoft Excel", "Microsoft Word", "Google Suite", "Project Management"
            );
            case "Personal Development" -> subNames = Arrays.asList(
                    "Leadership", "Career Development", "Happiness & Mindfulness",
                    "Productivity", "Personal Finance", "Creativity"
            );
            case "Design" -> subNames = Arrays.asList(
                    "Graphic Design", "UI/UX", "3D & Animation", "Fashion Design",
                    "Interior Design", "Architectural Design"
            );
            case "Marketing" -> subNames = Arrays.asList(
                    "Digital Marketing", "SEO", "Social Media Marketing", "Content Marketing",
                    "Branding", "Advertising"
            );
            case "Lifestyle" -> subNames = Arrays.asList(
                    "Travel", "Food & Cooking", "Home & Garden", "Pets", "Relationships"
            );
            case "Photography & Video" -> subNames = Arrays.asList(
                    "Photography", "Video Editing", "Cinematography", "Drone Photography"
            );
            default -> subNames = List.of();
        }

        for (String name : subNames) {
            Category sub = new Category();
            sub.setName(name);
            sub.setParent(root);
            sub.setVisible(true);
            categoryRepository.save(sub);
            logger.info("[CATEGORY] Created subcategory: {} -> {}", root.getName(), name);
        }
    }
}

