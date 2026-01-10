package vn.uit.lms.config.init;

import com.github.javafaker.Faker;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Example;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.uit.lms.core.domain.*;
import vn.uit.lms.core.domain.assessment.*;
import vn.uit.lms.core.domain.assignment.Assignment;
import vn.uit.lms.core.domain.assignment.Submission;
import vn.uit.lms.core.domain.assignment.SubmissionFile;
import vn.uit.lms.core.domain.billing.PaymentTransaction;
import vn.uit.lms.core.domain.billing.Payout;
import vn.uit.lms.core.domain.billing.RevenueShareConfig;
import vn.uit.lms.core.domain.community.comment.Comment;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.core.domain.community.report.ViolationReport;
import vn.uit.lms.core.domain.course.*;
import vn.uit.lms.core.domain.course.content.Chapter;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.course.content.LessonResource;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.core.domain.learning.Certificate;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.domain.learning.Progress;
import vn.uit.lms.core.repository.*;
import vn.uit.lms.core.repository.assessment.*;
import vn.uit.lms.core.repository.assignment.*;
import vn.uit.lms.core.repository.billing.*;
import vn.uit.lms.core.repository.community.comment.CommentRepository;
import vn.uit.lms.core.repository.community.notification.NotificationRepository;
import vn.uit.lms.core.repository.community.report.ViolationReportRepository;
import vn.uit.lms.core.repository.course.*;
import vn.uit.lms.core.repository.course.content.*;
import vn.uit.lms.core.repository.learning.*;
import vn.uit.lms.service.helper.SlugGenerator;
import vn.uit.lms.service.helper.StudentCodeGenerator;
import vn.uit.lms.service.helper.TeacherCodeGenerator;
import vn.uit.lms.shared.constant.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Comprehensive Fake Data Initializer
 * Seeds the database with realistic test data for all entities
 */
@Order(2)
@Component
public class FakeDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(FakeDataInitializer.class);
    private final Faker faker = new Faker(new Locale("vi"));

    // Core Repositories
    private final AccountRepository accountRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentCodeGenerator studentCodeGenerator;
    private final TeacherCodeGenerator teacherCodeGenerator;

    // Course Repositories
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CourseRepository courseRepository;
    private final CourseTagRepository courseTagRepository;
    private final CourseVersionRepository courseVersionRepository;
    private final CourseReviewRepository courseReviewRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final LessonResourceRepository lessonResourceRepository;

    // Learning Repositories
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final CertificateRepository certificateRepository;

    // Assessment Repositories
    private final QuestionBankRepository questionBankRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAttemptAnswerRepository quizAttemptAnswerRepository;

    // Assignment Repositories
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionFileRepository submissionFileRepository;

    // Community Repositories
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final ViolationReportRepository violationReportRepository;

    // Billing Repositories
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PayoutRepository payoutRepository;
    private final RevenueShareConfigRepository revenueShareConfigRepository;

    // Helpers
    private final SlugGenerator slugGenerator;

    public FakeDataInitializer(
            AccountRepository accountRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            PasswordEncoder passwordEncoder,
            StudentCodeGenerator studentCodeGenerator,
            TeacherCodeGenerator teacherCodeGenerator,
            CategoryRepository categoryRepository,
            TagRepository tagRepository,
            CourseRepository courseRepository,
            CourseTagRepository courseTagRepository,
            CourseVersionRepository courseVersionRepository,
            CourseReviewRepository courseReviewRepository,
            ChapterRepository chapterRepository,
            LessonRepository lessonRepository,
            LessonResourceRepository lessonResourceRepository,
            EnrollmentRepository enrollmentRepository,
            ProgressRepository progressRepository,
            CertificateRepository certificateRepository,
            QuestionBankRepository questionBankRepository,
            QuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository,
            QuizRepository quizRepository,
            QuizQuestionRepository quizQuestionRepository,
            QuizAttemptRepository quizAttemptRepository,
            QuizAttemptAnswerRepository quizAttemptAnswerRepository,
            AssignmentRepository assignmentRepository,
            SubmissionRepository submissionRepository,
            SubmissionFileRepository submissionFileRepository,
            CommentRepository commentRepository,
            NotificationRepository notificationRepository,
            ViolationReportRepository violationReportRepository,
            PaymentTransactionRepository paymentTransactionRepository,
            PayoutRepository payoutRepository,
            RevenueShareConfigRepository revenueShareConfigRepository,
            SlugGenerator slugGenerator
    ) {
        this.accountRepository = accountRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentCodeGenerator = studentCodeGenerator;
        this.teacherCodeGenerator = teacherCodeGenerator;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.courseRepository = courseRepository;
        this.courseTagRepository = courseTagRepository;
        this.courseVersionRepository = courseVersionRepository;
        this.courseReviewRepository = courseReviewRepository;
        this.chapterRepository = chapterRepository;
        this.lessonRepository = lessonRepository;
        this.lessonResourceRepository = lessonResourceRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.certificateRepository = certificateRepository;
        this.questionBankRepository = questionBankRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizAttemptAnswerRepository = quizAttemptAnswerRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.submissionFileRepository = submissionFileRepository;
        this.commentRepository = commentRepository;
        this.notificationRepository = notificationRepository;
        this.violationReportRepository = violationReportRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.payoutRepository = payoutRepository;
        this.revenueShareConfigRepository = revenueShareConfigRepository;
        this.slugGenerator = slugGenerator;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // NOTE: We keep this check, but we also make the dictionary creation (Categories/Tags) idempotent
        // so that if you have categories but NO accounts, it won't crash.
        if (accountRepository.count() > 3) {
            logger.info("Fake data already exists. Skipping initialization.");
            return;
        }

        logger.info("======== Starting Fake Data Initialization ========");

        // 1. Create base data (Safe from Duplicate Key Errors)
        List<Category> categories = createCategories();
        List<Tag> tags = createTags();

        // 2. Create accounts and profiles
        List<Student> students = createStudents(30);
        List<Teacher> teachers = createTeachers(10);

        // 3. Create revenue share config
        createRevenueShareConfig();

        // 4. Create courses with full content
        List<Course> courses = createCoursesWithContent(teachers, categories, tags);

        // 5. Create enrollments and progress
        createEnrollmentsAndProgress(students, courses);

        // 6. Create payments
        createPayments(students);

        // 7. Create payouts for teachers
        createPayouts(teachers);

        // 8. Create community content
        createComments(students, courses);
        createNotifications(students, teachers);
        createViolationReports(students, courses);

        logger.info("======== Fake Data Initialization Completed ========");
    }

    // ==========================================
    // FIXED: Helper methods to safely get or create entities
    // ==========================================

    private Category getOrCreateCategory(String name, Category parent) {
        String slug = slugGenerator.generate(name);

        // Use Example matcher to find by slug without needing a custom query in Repository
        Category probe = new Category();
        probe.setSlug(slug);

        Optional<Category> existing = categoryRepository.findOne(Example.of(probe));
        if (existing.isPresent()) {
            return existing.get();
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(faker.lorem().sentence(10));
        category.setSlug(slug);
        category.setParent(parent);
        category.setVisible(true);
        return categoryRepository.save(category);
    }

    private Tag getOrCreateTag(String name) {
        String slug = slugGenerator.generate(name);

        Tag probe = new Tag();
        probe.setSlug(slug);

        Optional<Tag> existing = tagRepository.findOne(Example.of(probe));
        if (existing.isPresent()) {
            return existing.get();
        }

        Tag tag = new Tag();
        tag.setName(name);
        tag.setSlug(slug);
        return tagRepository.save(tag);
    }

    // ==========================================
    // UPDATED: Create methods using safe helpers
    // ==========================================

    private List<Category> createCategories() {
        logger.info("Creating categories...");
        List<Category> categories = new ArrayList<>();

        String[] rootNames = {
                "Phát triển Web", "Phát triển Mobile", "Khoa học Dữ liệu",
                "Kinh doanh", "Thiết kế", "Marketing", "Nhiếp ảnh", "Âm nhạc"
        };

        for (String name : rootNames) {
            // FIXED: Use safe method
            Category category = getOrCreateCategory(name, null);
            categories.add(category);

            // Create 2-3 subcategories
            int subCount = faker.random().nextInt(2, 4);
            for (int i = 0; i < subCount; i++) {
                String subName = faker.educator().course();
                // FIXED: Use safe method for subcategories too
                Category subCategory = getOrCreateCategory(subName, category);
                categories.add(subCategory);
            }
        }

        logger.info("Created or Found {} categories", categories.size());
        return categories;
    }

    private List<Tag> createTags() {
        logger.info("Creating tags...");
        List<Tag> tags = new ArrayList<>();

        String[] tagNames = {
                "Java", "Python", "JavaScript", "React", "Angular", "Vue.js",
                "Spring Boot", "Node.js", "Django", "Machine Learning", "AI",
                "Docker", "Kubernetes", "AWS", "Azure", "UI/UX", "Photoshop",
                "Figma", "Marketing Digital", "SEO", "Content Marketing"
        };

        for (String name : tagNames) {
            // FIXED: Use safe method
            Tag tag = getOrCreateTag(name);
            tags.add(tag);
        }

        logger.info("Created or Found {} tags", tags.size());
        return tags;
    }

    // ... Rest of your existing methods (createStudents, createTeachers, etc.) remain unchanged ...

    private List<Student> createStudents(int count) {
        logger.info("Creating {} students...", count);
        List<Student> students = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            String username = "student" + i;

            // Basic check to prevent duplicate user error if re-run partially
            if (accountRepository.findOneByUsername(username).isPresent()) {
                continue;
            }

            Account account = new Account();
            account.setUsername(username);
            account.setEmail("student" + i + "@lms.com");
            account.setPasswordHash(passwordEncoder.encode("password123"));
            account.setRole(Role.STUDENT);
            account.setStatus(AccountStatus.ACTIVE);
            account.setAvatarUrl("https://i.pravatar.cc/150?img=" + (i + 1));
            account = accountRepository.save(account);

            Student student = new Student();
            student.setAccount(account);
            student.setStudentCode(studentCodeGenerator.generate());
            student.setFullName(faker.name().fullName());
            student.setPhone(faker.phoneNumber().cellPhone());
            student.setBio(faker.lorem().paragraph());
            students.add(studentRepository.save(student));
        }

        logger.info("Created {} students", students.size());
        return students;
    }

    private List<Teacher> createTeachers(int count) {
        logger.info("Creating {} teachers...", count);
        List<Teacher> teachers = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            String username = "teacher" + i;

            if (accountRepository.findOneByUsername(username).isPresent()) {
                continue;
            }

            Account account = new Account();
            account.setUsername(username);
            account.setEmail("teacher" + i + "@lms.com");
            account.setPasswordHash(passwordEncoder.encode("password123"));
            account.setRole(Role.TEACHER);
            account.setStatus(AccountStatus.ACTIVE);
            account.setAvatarUrl("https://i.pravatar.cc/150?img=" + (i + 50));
            account = accountRepository.save(account);

            Teacher teacher = new Teacher();
            teacher.setAccount(account);
            teacher.setTeacherCode(teacherCodeGenerator.generate());
            teacher.setFullName(faker.name().fullName());
            teacher.setPhone(faker.phoneNumber().cellPhone());
            teacher.setBio(faker.lorem().paragraph(3));
            teacher.setDegree(faker.job().title());
            teacher.setApproved(true);
            teachers.add(teacherRepository.save(teacher));
        }

        logger.info("Created {} teachers", teachers.size());
        return teachers;
    }

    private void createRevenueShareConfig() {
        if (revenueShareConfigRepository.count() > 0) return; // Simple check

        RevenueShareConfig config = new RevenueShareConfig();
        config.setPercentage(BigDecimal.valueOf(90.00)); // Teacher gets 90%
        config.setEffectiveFrom(LocalDate.now().minusDays(30));
        config.setIsActive(true);
        revenueShareConfigRepository.save(config);
        logger.info("Created revenue share config");
    }

    private List<Course> createCoursesWithContent(List<Teacher> teachers, List<Category> categories, List<Tag> tags) {
        logger.info("Creating courses with full content...");
        List<Course> courses = new ArrayList<>();

        if (teachers.isEmpty()) return courses; // Guard

        for (Teacher teacher : teachers) {
            // Each teacher creates 2-4 courses
            int courseCount = faker.random().nextInt(2, 5);

            for (int c = 0; c < courseCount; c++) {
                Course course = createCourse(teacher, categories, tags);
                courses.add(course);

                // Create course version
                CourseVersion courseVersion = createCourseVersion(course);

                // Create chapters with lessons
                List<Chapter> chapters = createChaptersWithLessons(courseVersion);

                // Create question bank and quizzes for lessons
                QuestionBank questionBank = createQuestionBank(courseVersion);
                createQuizzesForLessons(chapters, questionBank);

                // Create assignments for lessons
                createAssignmentsForLessons(chapters);
            }
        }

        logger.info("Created {} courses with full content", courses.size());
        return courses;
    }

    private Course createCourse(Teacher teacher, List<Category> categories, List<Tag> tags) {
        Course course = new Course();
        course.setTeacher(teacher);
        course.setTitle(faker.educator().course() + " - " + faker.programmingLanguage().name());
        course.setSlug(slugGenerator.generate(course.getTitle()));
        course.setThumbnailUrl("https://picsum.photos/800/450?random=" + faker.random().nextInt(1000));
        course.setDifficulty(Difficulty.values()[faker.random().nextInt(Difficulty.values().length)]);
        course.setIsClosed(false);

        // Set category
        Category category = categories.get(faker.random().nextInt(categories.size()));
        course.setCategory(category);

        course = courseRepository.save(course);

        // --- FIX STARTS HERE ---
        // 1. Determine how many tags to add (e.g., 3 to 6 tags)
        int tagCount = faker.random().nextInt(3, 6);

        // 2. Create a copy of the tags list to shuffle (so we pick unique random tags)
        List<Tag> shuffledTags = new ArrayList<>(tags);
        Collections.shuffle(shuffledTags);

        // 3. Pick the first 'tagCount' tags from the shuffled list
        // We also check (i < shuffledTags.size()) to avoid errors if you request more tags than exist
        for (int i = 0; i < tagCount && i < shuffledTags.size(); i++) {
            Tag tag = shuffledTags.get(i);

            CourseTag courseTag = new CourseTag();
            courseTag.setCourse(course);
            courseTag.setTag(tag);
            courseTagRepository.save(courseTag);
        }
        // --- FIX ENDS HERE ---

        return course;
    }

    private CourseVersion createCourseVersion(Course course) {
        CourseVersion version = new CourseVersion();
        version.setCourse(course);
        version.setVersionNumber(1);
        version.setTitle(course.getTitle());
        version.setDescription(faker.lorem().paragraph(5));
        version.setPrice(BigDecimal.valueOf(faker.number().numberBetween(199000, 2999000)));
        version.setStatus(CourseStatus.PUBLISHED);
        version.setPublishedAt(Instant.now().minus(faker.random().nextInt(1, 90), ChronoUnit.DAYS));
        version.setCreatedBy(course.getTeacher().getAccount().getUsername());
        return courseVersionRepository.save(version);
    }

    private List<Chapter> createChaptersWithLessons(CourseVersion courseVersion) {
        List<Chapter> chapters = new ArrayList<>();
        int chapterCount = faker.random().nextInt(5, 10);

        for (int i = 0; i < chapterCount; i++) {
            Chapter chapter = new Chapter();
            chapter.setCourseVersion(courseVersion);
            chapter.setTitle("Chương " + (i + 1) + ": " + faker.educator().course());
            chapter.setDescription(faker.lorem().paragraph(2));
            chapter.setOrderIndex(i);
            chapter = chapterRepository.save(chapter);
            chapters.add(chapter);

            // Create lessons for this chapter
            createLessons(chapter);
        }

        return chapters;
    }

    private void createLessons(Chapter chapter) {
        int lessonCount = faker.random().nextInt(3, 8);

        for (int i = 0; i < lessonCount; i++) {
            Lesson lesson = new Lesson();
            lesson.setChapter(chapter);
            lesson.setTitle("Bài " + (i + 1) + ": " + faker.lorem().sentence(5));
            lesson.setType(LessonType.VIDEO);
            lesson.setShortDescription(faker.lorem().sentence(10));
            lesson.setVideoObjectKey("videos/" + faker.internet().uuid() + ".mp4");
            lesson.setVideoStatus(VideoStatus.READY);
            lesson.setDurationSeconds(faker.random().nextInt(300, 3600));
            lesson.setOrderIndex(i);
            lesson.setIsPreview(i < 2); // First 2 lessons are preview
            lesson = lessonRepository.save(lesson);

            // Create lesson resources
            createLessonResources(lesson);
        }
    }

    private void createLessonResources(Lesson lesson) {
        int resourceCount = faker.random().nextInt(1, 4);

        for (int i = 0; i < resourceCount; i++) {
            LessonResource resource = new LessonResource();
            resource.setLesson(lesson);
            resource.setTitle(faker.file().fileName());
            resource.setResourceType(ResourceType.FILE);
            resource.setExternalUrl("https://example.com/files/" + faker.file().fileName());
            resource.setFileSizeBytes((long) faker.number().numberBetween(100000, 5000000));
            lessonResourceRepository.save(resource);
        }
    }

    private QuestionBank createQuestionBank(CourseVersion courseVersion) {
        QuestionBank bank = new QuestionBank();
        bank.setTeacher(courseVersion.getCourse().getTeacher());
        bank.setName("Ngân hàng câu hỏi - " + courseVersion.getTitle());
        bank.setDescription("Tập hợp các câu hỏi cho khóa học");
        bank = questionBankRepository.save(bank);

        // Create questions
        createQuestions(bank);

        return bank;
    }

    private void createQuestions(QuestionBank bank) {
        int questionCount = faker.random().nextInt(20, 50);

        for (int i = 0; i < questionCount; i++) {
            Question question = new Question();
            question.setQuestionBank(bank);
            question.setContent("Câu hỏi " + (i + 1) + ": " + faker.lorem().sentence(10) + "?");
            question.setType(QuestionType.MULTIPLE_CHOICE);
            question.setMaxPoints((double) faker.random().nextInt(1, 5));
            question = questionRepository.save(question);

            // Create answer options
            createAnswerOptions(question);
        }
    }

    private void createAnswerOptions(Question question) {
        String[] options = {"A", "B", "C", "D"};
        int correctIndex = faker.random().nextInt(4);

        for (int i = 0; i < 4; i++) {
            AnswerOption option = new AnswerOption();
            option.setQuestion(question);
            option.setContent("Đáp án " + options[i] + ": " + faker.lorem().sentence(8));
            option.setCorrect(i == correctIndex);
            option.setOrderIndex(i);
            answerOptionRepository.save(option);
        }
    }

    private void createQuizzesForLessons(List<Chapter> chapters, QuestionBank questionBank) {
        // Create quizzes for some lessons
        for (Chapter chapter : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

            for (Lesson lesson : lessons) {
                // 40% chance to have a quiz for this lesson
                if (faker.random().nextInt(10) > 6) {
                    Quiz quiz = new Quiz();
                    quiz.setLesson(lesson);
                    quiz.setTitle("Bài kiểm tra: " + lesson.getTitle());
                    quiz.setDescription(faker.lorem().paragraph(2));
                    quiz.setTimeLimitMinutes(faker.random().nextInt(15, 60));
                    quiz.setPassingScore((double) faker.random().nextInt(60, 80));
                    quiz.setMaxAttempts(3);
                    quiz.setRandomizeQuestions(true);
                    quiz.setRandomizeOptions(true);
                    quiz = quizRepository.save(quiz);

                    // Add questions to quiz
                    addQuestionsToQuiz(quiz, questionBank);
                }
            }
        }
    }

    private void addQuestionsToQuiz(Quiz quiz, QuestionBank questionBank) {
        List<Question> allQuestions = questionRepository.findByQuestionBankId(questionBank.getId());
        if (allQuestions.isEmpty()) return;

        int questionCount = Math.min(faker.random().nextInt(5, 15), allQuestions.size());

        Collections.shuffle(allQuestions);
        for (int i = 0; i < questionCount; i++) {
            QuizQuestion quizQuestion = new QuizQuestion();
            quizQuestion.setQuiz(quiz);
            quizQuestion.setQuestion(allQuestions.get(i));
            quizQuestion.setOrderIndex(i);
            quizQuestionRepository.save(quizQuestion);
        }
    }

    private void createAssignmentsForLessons(List<Chapter> chapters) {
        // Create assignments for some lessons
        for (Chapter chapter : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

            for (Lesson lesson : lessons) {
                // 30% chance to have an assignment for this lesson
                if (faker.random().nextInt(10) > 7) {
                    Assignment assignment = new Assignment();
                    assignment.setLesson(lesson);
                    assignment.setTitle("Bài tập thực hành: " + lesson.getTitle());
                    assignment.setDescription(generateAssignmentDescription());
                    assignment.setTotalPoints(100);
                    assignment.setDueDate(Instant.now().plus(faker.random().nextInt(7, 30), ChronoUnit.DAYS));
                    assignment.setMaxAttempts(3);
                    assignment.setTimeLimitMinutes(faker.random().nextInt(30, 120));
                    assignmentRepository.save(assignment);
                }
            }
        }
    }

    private String generateAssignmentDescription() {
        return "## Yêu cầu\n\n" +
                faker.lorem().paragraph(3) + "\n\n" +
                "## Hướng dẫn nộp bài\n\n" +
                "1. " + faker.lorem().sentence() + "\n" +
                "2. " + faker.lorem().sentence() + "\n" +
                "3. " + faker.lorem().sentence() + "\n\n" +
                "## Tiêu chí đánh giá\n\n" +
                faker.lorem().paragraph(2);
    }

    private void createEnrollmentsAndProgress(List<Student> students, List<Course> courses) {
        logger.info("Creating enrollments and progress...");

        for (Student student : students) {
            // Each student enrolls in 2-5 courses
            int enrollCount = faker.random().nextInt(2, 6);
            Collections.shuffle(courses);

            for (int i = 0; i < Math.min(enrollCount, courses.size()); i++) {
                Course course = courses.get(i);

                // Get the latest version (first version for now)
                List<CourseVersion> versions = course.getVersions();
                if (versions == null || versions.isEmpty()) {
                    continue;
                }
                CourseVersion courseVersion = versions.get(0);

                Enrollment enrollment = new Enrollment();
                enrollment.setStudent(student);
                enrollment.setCourse(course);
                enrollment.setCourseVersion(courseVersion);
                enrollment.setEnrolledAt(Instant.now().minus(faker.random().nextInt(1, 60), ChronoUnit.DAYS));
                enrollment.setStatus(EnrollmentStatus.ENROLLED);
                enrollment = enrollmentRepository.save(enrollment);

                // Create progress for lessons
                createProgress(enrollment, courseVersion);

                // Create quiz attempts
                createQuizAttempts(student, courseVersion);

                // Create submissions
                createSubmissions(student, courseVersion);

                // Maybe complete the course
                if (faker.random().nextInt(10) > 7) {
                    enrollment.setStatus(EnrollmentStatus.COMPLETED);
                    enrollment.setEndAt(Instant.now().minus(faker.random().nextInt(1, 30), ChronoUnit.DAYS));
                    enrollmentRepository.save(enrollment);

                    // Create certificate
                    createCertificate(student, course, courseVersion);
                }

                // Create review
                if (faker.random().nextInt(10) > 5) {
                    createReview(student, course);
                }
            }
        }

        logger.info("Created enrollments and progress");
    }

    private void createProgress(Enrollment enrollment, CourseVersion courseVersion) {
        List<Chapter> chapters = chapterRepository.findAllByCourseVersionOrderByOrderIndexAsc(courseVersion);

        for (Chapter chapter : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

            for (Lesson lesson : lessons) {
                // Randomly complete lessons
                if (faker.random().nextInt(10) > 3) {
                    Progress progress = new Progress();
                    progress.setStudent(enrollment.getStudent());
                    progress.setCourse(enrollment.getCourse());
                    progress.setCourseVersion(enrollment.getCourseVersion());
                    progress.setLesson(lesson);
                    progress.setStatus(ProgressStatus.COMPLETED);
                    progress.setCompletedAt(Instant.now().minus(faker.random().nextInt(1, 30), ChronoUnit.DAYS));
                    progressRepository.save(progress);
                }
            }
        }
    }

    private void createQuizAttempts(Student student, CourseVersion courseVersion) {
        List<Chapter> chapters = chapterRepository.findAllByCourseVersionOrderByOrderIndexAsc(courseVersion);

        for (Chapter chapter : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

            for (Lesson lesson : lessons) {
                List<Quiz> quizzes = quizRepository.findByLessonId(lesson.getId());

                for (Quiz quiz : quizzes) {
                    // Student attempts some quizzes
                    if (faker.random().nextInt(10) > 4) {
                        int attemptCount = faker.random().nextInt(1, 3);

                        for (int i = 0; i < attemptCount; i++) {
                            QuizAttempt attempt = new QuizAttempt();
                            attempt.setQuiz(quiz);
                            attempt.setStudent(student);
                            attempt.setStartedAt(Instant.now().minus(faker.random().nextInt(1, 30), ChronoUnit.DAYS));
                            attempt.setFinishedAt(attempt.getStartedAt().plus(faker.random().nextInt(10, 50), ChronoUnit.MINUTES));

                            Double score = (double) faker.random().nextInt(50, 100);
                            attempt.setTotalScore(score);
                            attempt.setStatus(QuizAttemptStatus.COMPLETED);
                            attempt = quizAttemptRepository.save(attempt);

                            // Create answers
                            createQuizAttemptAnswers(attempt);
                        }
                    }
                }
            }
        }
    }

    private void createQuizAttemptAnswers(QuizAttempt attempt) {
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizId(attempt.getQuiz().getId());

        for (QuizQuestion quizQuestion : quizQuestions) {
            List<AnswerOption> options = answerOptionRepository.findByQuestionId(quizQuestion.getQuestion().getId());

            if (!options.isEmpty()) {
                AnswerOption selectedOption = options.get(faker.random().nextInt(options.size()));

                QuizAttemptAnswer answer = new QuizAttemptAnswer();
                answer.setQuizAttempt(attempt);
                answer.setQuestion(quizQuestion.getQuestion());
                answer.setSelectedOption(selectedOption);
                answer.setScore(selectedOption.isCorrect() ? quizQuestion.getQuestion().getMaxPoints() : 0.0);
                answer.setGraded(true);
                quizAttemptAnswerRepository.save(answer);
            }
        }
    }

    private void createSubmissions(Student student, CourseVersion courseVersion) {
        List<Chapter> chapters = chapterRepository.findAllByCourseVersionOrderByOrderIndexAsc(courseVersion);

        for (Chapter chapter : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

            for (Lesson lesson : lessons) {
                List<Assignment> assignments = assignmentRepository.findByLessonId(lesson.getId());

                for (Assignment assignment : assignments) {
                    // Student submits some assignments
                    if (faker.random().nextInt(10) > 3) {
                        Submission submission = new Submission();
                        submission.setStudent(student);
                        submission.setAssignment(assignment);
                        submission.setContent("# Bài làm\n\n" + faker.lorem().paragraph(5));
                        submission.setSubmittedAt(Instant.now().minus(faker.random().nextInt(1, 20), ChronoUnit.DAYS));

                        // Maybe graded
                        if (faker.random().nextInt(10) > 4) {
                            submission.setScore((double) faker.random().nextInt(60, 100));
                            submission.setFeedback(faker.lorem().paragraph(2));
                            submission.setGradedAt(submission.getSubmittedAt().plus(faker.random().nextInt(1, 5), ChronoUnit.DAYS));
                        }

                        submission = submissionRepository.save(submission);

                        // Create submission files
                        createSubmissionFiles(submission);
                    }
                }
            }
        }
    }

    private void createSubmissionFiles(Submission submission) {
        int fileCount = faker.random().nextInt(1, 4);

        for (int i = 0; i < fileCount; i++) {
            FileStorage fileStorage = new FileStorage();
            fileStorage.setStorageKey("submissions/" + faker.internet().uuid());
            fileStorage.setStorageProvider(vn.uit.lms.shared.constant.StorageProvider.LOCAL);
            fileStorage.setOriginalName(faker.file().fileName());
            fileStorage.setMimeType("application/pdf");
            fileStorage.setSizeBytes((long) faker.number().numberBetween(100000, 10000000));
            // Assuming FileStorage cascades or just keeping memory object for SubmissionFile
            // Ideally save fileStorage here if it's an entity

            SubmissionFile file = new SubmissionFile();
            file.setSubmission(submission);
            file.setFile(fileStorage);
            submissionFileRepository.save(file);
        }
    }

    private void createCertificate(Student student, Course course, CourseVersion courseVersion) {
        Certificate certificate = new Certificate();
        certificate.setStudent(student);
        certificate.setCourse(course);
        certificate.setCourseVersion(courseVersion);
        certificate.setCode("CERT-" + faker.number().digits(10));
        certificate.setFileUrl("https://example.com/certificates/" + certificate.getCode());
        certificateRepository.save(certificate);
    }

    private void createReview(Student student, Course course) {
        CourseReview review = new CourseReview();
        review.setStudent(student);
        review.setCourse(course);
        int ratingValue = faker.random().nextInt(3, 6);
        review.setRating((byte) ratingValue);
        review.setContent(faker.lorem().paragraph(3));
        courseReviewRepository.save(review);
    }

    private void createPayments(List<Student> students) {
        logger.info("Creating payment transactions...");

        for (Student student : students) {
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId(), org.springframework.data.domain.Pageable.unpaged()).getContent();

            for (Enrollment enrollment : enrollments) {
                PaymentTransaction payment = new PaymentTransaction();
                payment.setStudent(student);
                payment.setCourse(enrollment.getCourse());
                payment.setCourseVersion(enrollment.getCourseVersion());
                payment.setAmount(enrollment.getCourseVersion().getPrice());
                payment.setPaymentMethod(faker.options().option(
                    PaymentProvider.MOMO,
                    PaymentProvider.VNPAY,
                    PaymentProvider.ZALOPAY
                ));
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setProviderTransactionId("TXN-" + faker.number().digits(12));
                payment.setPaidAt(enrollment.getEnrolledAt());
                paymentTransactionRepository.save(payment);
            }
        }

        logger.info("Created payment transactions");
    }

    private void createPayouts(List<Teacher> teachers) {
        logger.info("Creating payouts...");

        for (Teacher teacher : teachers) {
            List<PaymentTransaction> payments = paymentTransactionRepository.findByTeacherId(teacher.getId());

            if (!payments.isEmpty()) {
                // Create monthly payouts
                for (int month = 0; month < 3; month++) {
                    BigDecimal totalRevenue = BigDecimal.ZERO;

                    for (PaymentTransaction payment : payments) {
                        totalRevenue = totalRevenue.add(payment.getAmount());
                    }

                    if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal teacherShare = totalRevenue.multiply(BigDecimal.valueOf(0.7));

                        Payout payout = new Payout();
                        payout.setTeacher(teacher);
                        payout.setAmount(teacherShare);
                        payout.setPayoutPeriod(java.time.YearMonth.now().minusMonths(month).toString());
                        payout.setStatus(PayoutStatus.values()[faker.random().nextInt(PayoutStatus.values().length)]);
                        payout.setBankTransactionId("PAYOUT-" + faker.number().digits(12));

                        if (payout.getStatus() == PayoutStatus.COMPLETED) {
                            payout.setPayoutDate(Instant.now().minus((month * 30) - 7, ChronoUnit.DAYS));
                        }

                        payoutRepository.save(payout);
                    }
                }
            }
        }

        logger.info("Created payouts");
    }

    private void createComments(List<Student> students, List<Course> courses) {
        logger.info("Creating comments...");

        for (Course course : courses) {
            // Get the first version
            List<CourseVersion> versions = course.getVersions();
            if (versions == null || versions.isEmpty()) {
                continue;
            }
            CourseVersion courseVersion = versions.get(0);

            List<Chapter> chapters = chapterRepository.findAllByCourseVersionOrderByOrderIndexAsc(courseVersion);

            // Course-level comments (Q&A)
            int courseCommentCount = faker.random().nextInt(5, 15);
            for (int i = 0; i < courseCommentCount; i++) {
                Student student = students.get(faker.random().nextInt(students.size()));

                Comment comment = new Comment();
                comment.setUser(student.getAccount());
                comment.setCourse(course);
                comment.setContent(generateQuestionContent());
                comment.setUpvotes(faker.random().nextInt(0, 20));
                comment.setIsPublic(true);
                comment = commentRepository.save(comment);

                // Teacher or other students reply
                if (faker.random().nextBoolean()) {
                    createReply(comment, course.getTeacher().getAccount());
                }
            }

            // Lesson-level comments
            for (Chapter chapter : chapters) {
                List<Lesson> lessons = lessonRepository.findByChapterOrderByOrderIndexAsc(chapter);

                for (Lesson lesson : lessons) {
                    int lessonCommentCount = faker.random().nextInt(2, 6);

                    for (int i = 0; i < lessonCommentCount; i++) {
                        Student student = students.get(faker.random().nextInt(students.size()));

                        Comment comment = new Comment();
                        comment.setUser(student.getAccount());
                        comment.setLesson(lesson);
                        comment.setContent(faker.lorem().paragraph(2));
                        comment.setUpvotes(faker.random().nextInt(0, 10));
                        comment.setIsPublic(true);
                        commentRepository.save(comment);
                    }
                }
            }
        }

        logger.info("Created comments");
    }

    private String generateQuestionContent() {
        String[] questionStarters = {
                "Thầy ơi, em chưa hiểu rõ về",
                "Cho em hỏi về",
                "Em có thắc mắc về phần",
                "Thầy có thể giải thích thêm về",
                "Em gặp lỗi khi"
        };

        return questionStarters[faker.random().nextInt(questionStarters.length)] + " " +
                faker.lorem().sentence(10) + "?";
    }

    private void createReply(Comment parent, Account account) {
        Comment reply = new Comment();
        reply.setUser(account);
        reply.setParent(parent);
        reply.setCourse(parent.getCourse());
        reply.setLesson(parent.getLesson());
        reply.setContent(generateAnswerContent());
        reply.setUpvotes(faker.random().nextInt(0, 15));
        reply.setIsPublic(true);
        commentRepository.save(reply);
    }

    private String generateAnswerContent() {
        return "Chào bạn! " + faker.lorem().paragraph(3) +
                "\n\nHy vọng giải đáp được thắc mắc của bạn!";
    }

    private void createNotifications(List<Student> students, List<Teacher> teachers) {
        logger.info("Creating notifications...");

        List<Account> allAccounts = new ArrayList<>();
        students.forEach(s -> allAccounts.add(s.getAccount()));
        teachers.forEach(t -> allAccounts.add(t.getAccount()));

        String[] notificationTypes = {"COURSE_UPDATE", "NEW_ENROLLMENT", "ASSIGNMENT_GRADE", "COMMENT_REPLY", "COURSE_APPROVED", "SYSTEM"};

        for (Account account : allAccounts) {
            int notificationCount = faker.random().nextInt(5, 15);

            for (int i = 0; i < notificationCount; i++) {
                Notification notification = new Notification();
                notification.setRecipient(account);
                String type = notificationTypes[faker.random().nextInt(notificationTypes.length)];
                notification.setType(type);
                notification.setTitle(generateNotificationTitle(type));
                notification.setContent(faker.lorem().paragraph(2));
                notification.setIsRead(faker.random().nextBoolean());

                if (notification.getIsRead()) {
                    notification.setDeliveredAt(Instant.now().minus(faker.random().nextInt(1, 10), ChronoUnit.DAYS));
                }

                notificationRepository.save(notification);
            }
        }

        logger.info("Created notifications");
    }

    private String generateNotificationTitle(String type) {
        return switch (type) {
            case "COURSE_UPDATE" -> "Khóa học đã được cập nhật";
            case "NEW_ENROLLMENT" -> "Học viên mới đăng ký khóa học";
            case "ASSIGNMENT_GRADE" -> "Bài tập của bạn đã được chấm điểm";
            case "COMMENT_REPLY" -> "Có người trả lời câu hỏi của bạn";
            case "COURSE_APPROVED" -> "Khóa học đã được phê duyệt";
            case "SYSTEM" -> "Thông báo hệ thống";
            default -> "Thông báo mới";
        };
    }

    private void createViolationReports(List<Student> students, List<Course> courses) {
        logger.info("Creating violation reports...");

        String[] reportTypes = {"SPAM", "HARASSMENT", "INAPPROPRIATE_CONTENT", "COPYRIGHT", "MISINFORMATION"};
        int reportCount = faker.random().nextInt(10, 20);

        for (int i = 0; i < reportCount; i++) {
            Student reporter = students.get(faker.random().nextInt(students.size()));
            Course course = courses.get(faker.random().nextInt(courses.size()));

            String reportType = reportTypes[faker.random().nextInt(reportTypes.length)];
            String description = generateReportDescription(reportType);

            // Use factory method instead of constructor
            ViolationReport report = ViolationReport.create(
                reporter.getAccount(),
                reportType,
                description
            );

            // Randomly assign target
            if (faker.random().nextBoolean()) {
                report.setTargetCourse(course);
            } else {
                // Report a comment
                List<Comment> comments = commentRepository.findByCourseIdAndParentIsNullAndDeletedAtIsNull(course.getId());
                if (!comments.isEmpty()) {
                    Comment comment = comments.get(faker.random().nextInt(comments.size()));
                    report.setTargetComment(comment);
                    report.setTargetAccount(comment.getUser());
                }
            }

            violationReportRepository.save(report);
        }

        logger.info("Created violation reports");
    }

    private String generateReportDescription(String type) {
        return switch (type) {
            case "SPAM" -> "Nội dung này là spam quảng cáo, không liên quan đến khóa học.";
            case "HARASSMENT" -> "Nội dung có tính chất quấy rối, xúc phạm người khác.";
            case "INAPPROPRIATE_CONTENT" -> "Nội dung không phù hợp với môi trường học tập.";
            case "COPYRIGHT" -> "Nội dung vi phạm bản quyền của tác giả khác.";
            case "MISINFORMATION" -> "Thông tin sai lệch, không chính xác.";
            default -> faker.lorem().paragraph(2);
        };
    }
}