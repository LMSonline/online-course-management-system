package vn.uit.lms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.service.storage.CloudinaryStorageService;
import vn.uit.lms.shared.annotation.Audit;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.AuditAction;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.teacher.UpdateTeacherRequest;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.course.CourseResponse;
import vn.uit.lms.shared.dto.response.student.StudentResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherDetailResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherRevenueResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherStatsResponse;
import vn.uit.lms.shared.exception.*;
import vn.uit.lms.shared.mapper.TeacherMapper;
import vn.uit.lms.shared.util.CloudinaryUtils;
import vn.uit.lms.shared.util.SecurityUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class TeacherService {

    private static final Logger log = LoggerFactory.getLogger(TeacherService.class);
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final TeacherRepository teacherRepository;
    private final AccountRepository accountRepository;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final CloudinaryUtils cloudinaryUtils;
    private final AccountService accountService;

    @Value("${app.avatar.max-size-bytes}")
    private long maxSizeBytes;

    public TeacherService(TeacherRepository teacherRepository,
                          AccountRepository accountRepository,
                          CloudinaryStorageService cloudinaryStorageService,
                          CloudinaryUtils cloudinaryUtils,
                          AccountService accountService) {
        this.teacherRepository = teacherRepository;
        this.accountRepository = accountRepository;
        this.cloudinaryStorageService = cloudinaryStorageService;
        this.cloudinaryUtils = cloudinaryUtils;
        this.accountService = accountService;
    }


    /**
     * Get teacher by ID
     * - TEACHER: Can only view their own profile
     * - ADMIN: Can view any teacher
     * - STUDENT: Can view approved teachers teaching their courses
     */
    public TeacherDetailResponse getTeacherById(Long id) {
        log.info("Fetching teacher by id: {}", id);

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization
        validateTeacherAccess(teacher);

        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Get teacher by teacher code
     * - TEACHER: Can only view their own profile
     * - ADMIN: Can view any teacher
     * - STUDENT: Can view approved teachers teaching their courses
     */
    public TeacherDetailResponse getTeacherByCode(String code) {
        log.info("Fetching teacher by code: {}", code);

        Teacher teacher = teacherRepository.findByTeacherCodeWithAccount(code)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with code: " + code));

        // Check authorization
        validateTeacherAccess(teacher);

        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Update teacher information
     * - TEACHER: Can only update their own profile
     * - ADMIN: Can update any teacher
     */
    @Transactional
    @Audit(table = "teachers", action = AuditAction.UPDATE)
    public TeacherDetailResponse updateTeacher(Long id, UpdateTeacherRequest request) {
        log.info("Updating teacher id: {}", id);

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check account is active
        if (teacher.getAccount().getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidStatusException("Cannot update inactive teacher account");
        }

        // Check authorization
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account currentAccount = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current account not found"));

        // TEACHER can only update their own profile
        if (currentAccount.getRole() == Role.TEACHER) {
            if (!teacher.getAccount().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Teachers can only update their own profile");
            }
        }

        // Validate unique teacher code if changed
        if (request.getTeacherCode() != null &&
                !request.getTeacherCode().equals(teacher.getTeacherCode())) {
            if (teacherRepository.findByTeacherCode(request.getTeacherCode()).isPresent()) {
                throw new InvalidRequestException("Teacher code already exists: " + request.getTeacherCode());
            }
            teacher.setTeacherCode(request.getTeacherCode());
        }

        // Update teacher information
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            teacher.setFullName(request.getFullName());
        }
        if (request.getBirthDate() != null) {
            teacher.setBirthDate(request.getBirthDate());
        }
        if (request.getGender() != null) {
            teacher.setGender(request.getGender());
        }
        if (request.getPhone() != null) {
            teacher.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            teacher.setBio(request.getBio());
        }
        if (request.getSpecialty() != null) {
            teacher.setSpecialty(request.getSpecialty());
        }
        if (request.getDegree() != null) {
            teacher.setDegree(request.getDegree());
        }

        teacher = teacherRepository.save(teacher);

        log.info("Teacher id: {} updated successfully", id);
        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Upload avatar for teacher
     * - TEACHER: Can only upload their own avatar
     */
    @Transactional
    public UploadAvatarResponse uploadTeacherAvatar(Long id, MultipartFile file) {
        log.info("Uploading avatar for teacher id: {}", id);

        // Validate file
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Only JPG, PNG, WEBP are allowed");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new InvalidFileException("File size exceeds " + (maxSizeBytes / 1024 / 1024) + "MB");
        }

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check account is active
        if (teacher.getAccount().getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidStatusException("Cannot update avatar for inactive teacher account");
        }

        // Check authorization - TEACHER can only upload their own avatar
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        if (!teacher.getAccount().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Teachers can only update their own avatar");
        }

        Account account = teacher.getAccount();
        String oldPublicId = account.getAvatarPublicId();

        // Upload avatar to Cloudinary
        CloudinaryStorageService.UploadResult uploadResult =
                cloudinaryStorageService.uploadAvatar(file, account.getId(), oldPublicId);

        // Delete old image if a new one is generated
        if (oldPublicId != null && !Objects.equals(oldPublicId, uploadResult.getPublicId())) {
            try {
                cloudinaryStorageService.deleteByPublicId(oldPublicId);
                log.info("Deleted old avatar: {}", oldPublicId);
            } catch (Exception ex) {
                log.warn("Failed to delete old avatar ({}): {}", oldPublicId, ex.getMessage());
            }
        }

        // Update avatar info in DB
        account.setAvatarUrl(uploadResult.getUrl());
        account.setAvatarPublicId(uploadResult.getPublicId());
        accountRepository.save(account);

        // Prepare response
        UploadAvatarResponse response = new UploadAvatarResponse();
        response.setAvatarUrl(uploadResult.getUrl());
        response.setThumbnailUrl(cloudinaryUtils.getThumbnailUrl(uploadResult.getPublicId(), 200, 200));

        log.info("Avatar uploaded successfully for teacher id: {}", id);
        return response;
    }

    /**
     * Request approval for teacher account
     * - TEACHER: Can request approval for their own account
     *
     * Full Implementation Plan:
     * 1. Validate teacher profile completeness:
     *    - Specialty and degree are required
     *    - Bio and phone are recommended
     *    - Avatar is recommended
     * 2. Create ApprovalRequest entity to track:
     *    - Request timestamp
     *    - Teacher information snapshot
     *    - Status (PENDING, APPROVED, REJECTED)
     *    - Processing timeline
     * 3. Send notification to admin:
     *    - Email notification with teacher details
     *    - In-app notification
     *    - Dashboard alert for pending approvals
     * 4. Set pending approval status flag
     * 5. Log approval request activity
     * 6. Return updated teacher profile with request status
     */
    @Transactional
    @Audit(table = "teachers", action = AuditAction.UPDATE)
    public TeacherDetailResponse requestApproval(Long id) {
        log.info("Teacher id: {} requesting approval", id);

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization - TEACHER can only request approval for themselves
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        if (!teacher.getAccount().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Teachers can only request approval for themselves");
        }

        // Check if already approved
        if (teacher.isApproved()) {
            throw new InvalidRequestException("Teacher is already approved");
        }

        // Validate profile completeness
        if (teacher.getSpecialty() == null || teacher.getSpecialty().isBlank()) {
            throw new InvalidRequestException("Specialty is required for approval request");
        }
        if (teacher.getDegree() == null || teacher.getDegree().isBlank()) {
            throw new InvalidRequestException("Degree is required for approval request");
        }

        // Implementation pending - requires ApprovalRequest entity and EmailService
        // When ApprovalRequest entity is available:
        // ApprovalRequest approvalRequest = ApprovalRequest.builder()
        //     .teacher(teacher)
        //     .requestDate(Instant.now())
        //     .status(ApprovalStatus.PENDING)
        //     .build();
        // approvalRequestRepository.save(approvalRequest);
        //
        // Send notification to admin:
        // emailService.sendTeacherApprovalRequestEmail(teacher);
        // notificationService.notifyAdminsOfPendingApproval(teacher);

        log.info("Approval request submitted for teacher id: {}", id);
        log.warn("Full approval workflow pending - requires ApprovalRequest entity and notification services");

        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Approve teacher (Admin only)
     *
     * Implementation Plan for Notifications:
     * 1. Send approval email to teacher:
     *    - Congratulations message
     *    - Next steps (creating courses, profile setup)
     *    - Platform guidelines and policies
     *    - Links to teacher dashboard
     * 2. Create in-app notification:
     *    - Notification type: TEACHER_APPROVED
     *    - Include approval date and approver info (optional)
     * 3. Update approval request status (if using ApprovalRequest entity)
     * 4. Log approval action in audit trail
     */
    @Transactional
    @Audit(table = "teachers", action = AuditAction.UPDATE)
    public TeacherDetailResponse approveTeacher(Long id, String note) {
        log.info("Approving teacher id: {}", id);

        // Verify admin role
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account currentAccount = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current account not found"));

        if (currentAccount.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can approve teachers");
        }

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        if (teacher.isApproved()) {
            throw new InvalidRequestException("Teacher is already approved");
        }

        teacher.setApproved(true);
        teacher.setApprovedBy(currentUserId);
        teacher.setApprovedAt(Instant.now());
        teacher.setRejectReason(null); // Clear any previous rejection reason

        teacher = teacherRepository.save(teacher);

        // Send approval notification - implementation pending
        // When EmailService is available:
        // emailService.sendTeacherApprovalEmail(teacher, note);
        // notificationService.createNotification(
        //     teacher.getAccount().getId(),
        //     NotificationType.TEACHER_APPROVED,
        //     "Your teacher account has been approved! You can now create and publish courses."
        // );
        //
        // Update approval request if exists:
        // approvalRequestRepository.findByTeacherId(id).ifPresent(request -> {
        //     request.setStatus(ApprovalStatus.APPROVED);
        //     request.setApprovedBy(currentUserId);
        //     request.setApprovedAt(Instant.now());
        //     request.setNote(note);
        //     approvalRequestRepository.save(request);
        // });

        log.info("Teacher id: {} approved successfully by admin id: {}", id, currentUserId);
        log.warn("Email notification pending - requires EmailService and NotificationService");

        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Reject teacher (Admin only)
     *
     * Implementation Plan for Notifications:
     * 1. Send rejection email to teacher:
     *    - Professional rejection message
     *    - Clear explanation of rejection reason
     *    - Steps to address issues
     *    - Information about re-application process
     *    - Support contact information
     * 2. Create in-app notification:
     *    - Notification type: TEACHER_REJECTED
     *    - Include rejection reason
     *    - Link to profile improvement suggestions
     * 3. Update approval request status (if using ApprovalRequest entity)
     * 4. Log rejection action in audit trail
     */
    @Transactional
    @Audit(table = "teachers", action = AuditAction.UPDATE)
    public TeacherDetailResponse rejectTeacher(Long id, String reason) {
        log.info("Rejecting teacher id: {}", id);

        // Verify admin role
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account currentAccount = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current account not found"));

        if (currentAccount.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can reject teachers");
        }

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        teacher.setApproved(false);
        teacher.setRejectReason(reason);
        teacher.setApprovedBy(null);
        teacher.setApprovedAt(null);

        teacher = teacherRepository.save(teacher);

        // Send rejection notification - implementation pending
        // When EmailService is available:
        // emailService.sendTeacherRejectionEmail(teacher, reason);
        // notificationService.createNotification(
        //     teacher.getAccount().getId(),
        //     NotificationType.TEACHER_REJECTED,
        //     "Your teacher application has been reviewed. Please check your email for details."
        // );
        //
        // Update approval request if exists:
        // approvalRequestRepository.findByTeacherId(id).ifPresent(request -> {
        //     request.setStatus(ApprovalStatus.REJECTED);
        //     request.setRejectedBy(currentUserId);
        //     request.setRejectedAt(Instant.now());
        //     request.setRejectionReason(reason);
        //     approvalRequestRepository.save(request);
        // });

        log.info("Teacher id: {} rejected by admin id: {} with reason: {}", id, currentUserId, reason);
        log.warn("Email notification pending - requires EmailService and NotificationService");

        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Get teacher's courses
     * - TEACHER: Can only view their own courses
     * - ADMIN: Can view any teacher's courses
     * - STUDENT: Can view approved teacher's published courses
     *
     * Implementation Plan:
     * 1. Query courses by teacher ID with optimized joins
     * 2. Map to CourseResponse with:
     *    - Course details (title, description, thumbnail)
     *    - Course status (DRAFT, PUBLISHED, ARCHIVED)
     *    - Enrollment count
     *    - Average rating and review count
     *    - Revenue information (for teacher/admin only)
     *    - Last updated date
     * 3. Add filters:
     *    - Status (DRAFT, PUBLISHED, ARCHIVED)
     *    - Search by course name or description
     *    - Category filter
     *    - Price range
     * 4. Sort by:
     *    - Creation date (newest/oldest)
     *    - Enrollment count (most/least popular)
     *    - Rating (highest/lowest)
     *    - Last updated date
     * 5. Access control:
     *    - Students only see PUBLISHED courses from APPROVED teachers
     *    - Teachers see all their own courses
     *    - Admins see all courses
     * 6. Consider caching for frequently accessed teacher profiles
     */
    public PageResponse<CourseResponse> getTeacherCourses(Long id, Pageable pageable) {
        log.info("Fetching courses for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization
        validateTeacherAccess(teacher);

        // Implementation pending - requires Course entity with teacher relationship
        // When Course entity and repository are available:
        // Specification<Course> spec = CourseSpecification.byTeacherId(id);
        //
        // // Apply access control filters based on current user role
        // Account currentAccount = accountService.getCurrentAccount();
        // if (currentAccount.getRole() == Role.STUDENT) {
        //     // Students only see published courses from approved teachers
        //     spec = spec.and(CourseSpecification.isPublished())
        //                .and(CourseSpecification.teacherIsApproved());
        // }
        //
        // Page<Course> coursePage = courseRepository.findAll(spec, pageable);
        // List<CourseResponse> courses = coursePage.getContent().stream()
        //     .map(course -> CourseResponse.builder()
        //         .id(course.getId())
        //         .title(course.getTitle())
        //         .description(course.getDescription())
        //         .status(course.getStatus())
        //         .enrollmentCount(course.getEnrollments().size())
        //         .averageRating(course.getAverageRating())
        //         .reviewCount(course.getReviews().size())
        //         .thumbnailUrl(course.getThumbnailUrl())
        //         .createdAt(course.getCreatedAt())
        //         .updatedAt(course.getUpdatedAt())
        //         .build())
        //     .toList();

        List<CourseResponse> courses = new ArrayList<>();
        Page<CourseResponse> page = new PageImpl<>(courses, pageable, 0);

        log.debug("Returning {} courses for teacher id: {}", courses.size(), id);
        log.warn("Course query pending - requires Course entity and CourseRepository");

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    /**
     * Get teacher's students (students enrolled in teacher's courses)
     * - TEACHER: Can only view their own students
     * - ADMIN: Can view any teacher's students
     *
     * Implementation Plan:
     * 1. Query distinct students enrolled in any of teacher's courses
     * 2. Use JOIN query for performance:
     *    SELECT DISTINCT s.* FROM students s
     *    JOIN enrollments e ON s.id = e.student_id
     *    JOIN courses c ON e.course_id = c.id
     *    WHERE c.teacher_id = :teacherId
     * 3. Map to StudentResponse with:
     *    - Basic student information (name, code, avatar)
     *    - Number of courses enrolled with this teacher
     *    - Overall progress across teacher's courses
     *    - Latest enrollment date
     *    - Activity status (active/inactive)
     * 4. Add filters:
     *    - Search by name or student code
     *    - Filter by specific course
     *    - Filter by enrollment status (ACTIVE, COMPLETED, DROPPED)
     *    - Filter by progress range
     * 5. Sort by:
     *    - Enrollment date (newest/oldest)
     *    - Student name (alphabetical)
     *    - Progress percentage
     *    - Activity (most/least active)
     * 6. Include statistics:
     *    - Total enrolled students
     *    - Active students count
     *    - Completion rate
     * 7. Consider pagination for large datasets
     * 8. Cache aggregated statistics for performance
     */
    public PageResponse<StudentResponse> getTeacherStudents(Long id, Pageable pageable) {
        log.info("Fetching students for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization - only teacher themselves or admin
        validateTeacherOwnershipOrAdmin(teacher);

        // Implementation pending - requires Enrollment entity and optimized queries
        // When Enrollment entity and repository are available:
        // Page<Student> studentPage = studentRepository.findDistinctByEnrollmentsCourseTeacherId(id, pageable);
        //
        // List<StudentResponse> students = studentPage.getContent().stream()
        //     .map(student -> {
        //         // Get enrollment statistics for this student with this teacher
        //         long enrollmentCount = enrollmentRepository
        //             .countByStudentIdAndCourseTeacherId(student.getId(), id);
        //         double avgProgress = enrollmentRepository
        //             .getAverageProgressByStudentIdAndTeacherId(student.getId(), id);
        //         Instant latestEnrollment = enrollmentRepository
        //             .getLatestEnrollmentDateByStudentIdAndTeacherId(student.getId(), id);
        //
        //         return StudentResponse.builder()
        //             .id(student.getId())
        //             .studentCode(student.getStudentCode())
        //             .fullName(student.getFullName())
        //             .email(student.getAccount().getEmail())
        //             .avatarUrl(student.getAccount().getAvatarUrl())
        //             .enrollmentCount((int) enrollmentCount)
        //             .averageProgress(avgProgress)
        //             .latestEnrollmentDate(latestEnrollment)
        //             .build();
        //     })
        //     .toList();

        List<StudentResponse> students = new ArrayList<>();
        Page<StudentResponse> page = new PageImpl<>(students, pageable, 0);

        log.debug("Returning {} students for teacher id: {}", students.size(), id);
        log.warn("Student enrollment query pending - requires Enrollment entity and optimized repository methods");

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    /**
     * Get teacher's revenue statistics
     * - TEACHER: Can only view their own revenue
     * - ADMIN: Can view any teacher's revenue
     *
     * Implementation Plan:
     * 1. Query all paid enrollments for teacher's courses with:
     *    - Join: Enrollment -> Payment -> Course -> Teacher
     *    - Filter: Payment status = COMPLETED
     *    - Filter: Course teacher_id = teacher.id
     * 2. Calculate total revenue:
     *    - Sum of all successful payments
     *    - Apply revenue share percentage (e.g., 70% to teacher, 30% platform fee)
     *    - Consider refunds (subtract refunded amounts)
     * 3. Break down by time periods:
     *    - Monthly revenue: Current month and last 12 months
     *    - Yearly revenue: Current year and historical years
     *    - Daily revenue: Last 30 days for trend analysis
     * 4. Break down by course:
     *    - Revenue per course
     *    - Enrollment count per course
     *    - Average revenue per enrollment
     *    - Top earning courses
     * 5. Include enrollment statistics:
     *    - Total enrollments (lifetime)
     *    - Monthly enrollments
     *    - Enrollment conversion rate
     * 6. Add filters:
     *    - Date range (start date, end date)
     *    - Specific course
     *    - Payment method
     * 7. Currency handling:
     *    - Support multiple currencies
     *    - Convert to teacher's preferred currency
     * 8. Caching strategy:
     *    - Cache monthly/yearly totals
     *    - Invalidate cache on new payment
     *    - Use Redis for high-traffic teachers
     * 9. Performance optimization:
     *    - Use database aggregation functions
     *    - Materialize monthly revenue in separate table
     *    - Schedule background jobs for statistics update
     */
    public TeacherRevenueResponse getTeacherRevenue(Long id) {
        log.info("Fetching revenue for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization - only teacher themselves or admin
        validateTeacherOwnershipOrAdmin(teacher);

        // Implementation pending - requires Payment, Enrollment entities and revenue calculation logic
        // When Payment and Enrollment entities are available:
        //
        // Calculate total revenue:
        // Double totalRevenue = paymentRepository
        //     .sumRevenueByTeacherId(id, PaymentStatus.COMPLETED);
        // Double teacherShare = totalRevenue * revenueSharePercentage;
        //
        // Calculate monthly revenue:
        // Instant startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        // Double monthlyRevenue = paymentRepository
        //     .sumRevenueByTeacherIdAndDateRange(id, startOfMonth, Instant.now());
        //
        // Calculate yearly revenue:
        // Instant startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        // Double yearlyRevenue = paymentRepository
        //     .sumRevenueByTeacherIdAndDateRange(id, startOfYear, Instant.now());
        //
        // Get enrollment counts:
        // Long totalEnrollments = enrollmentRepository.countByTeacherId(id);
        // Long monthlyEnrollments = enrollmentRepository
        //     .countByTeacherIdAndDateRange(id, startOfMonth, Instant.now());
        //
        // Get revenue by course:
        // List<RevenueByCourse> revenueByCourse = paymentRepository
        //     .getRevenueGroupedByCourse(id);

        TeacherRevenueResponse response = TeacherRevenueResponse.builder()
                .totalRevenue(0.0)
                .monthlyRevenue(0.0)
                .yearlyRevenue(0.0)
                .totalEnrollments(0L)
                .monthlyEnrollments(0L)
                .revenueByCourse(new ArrayList<>())
                .lastUpdated(Instant.now())
                .build();

        log.debug("Returning revenue data for teacher id: {}", id);
        log.warn("Revenue calculation pending - requires Payment entity, Enrollment entity, and revenue share configuration");

        return response;
    }

    /**
     * Get teacher statistics
     * - TEACHER: Can view their own stats
     * - ADMIN: Can view any teacher's stats
     *
     * Implementation Plan:
     * 1. Count courses by status:
     *    - Total courses: All courses created by teacher
     *    - Published courses: Status = PUBLISHED
     *    - Draft courses: Status = DRAFT
     *    - Archived courses: Status = ARCHIVED
     *    - Pending review courses: Status = PENDING_REVIEW
     * 2. Count total students:
     *    - Query distinct students enrolled in any teacher's course
     *    - Consider only active enrollments
     * 3. Calculate average rating:
     *    - Aggregate all course reviews for teacher's courses
     *    - Calculate weighted average based on review count
     *    - Round to 2 decimal places
     * 4. Count total reviews:
     *    - Sum of all reviews across all teacher's courses
     *    - Group by rating (5-star, 4-star, etc.) for distribution
     * 5. Calculate total revenue:
     *    - Use getTeacherRevenue() method
     *    - Consider only completed payments
     *    - Apply revenue share percentage
     * 6. Additional statistics:
     *    - Course completion rate
     *    - Student engagement rate
     *    - Average course duration
     *    - Most popular course
     *    - Recent activity (courses created, updated in last 30 days)
     * 7. Caching strategy:
     *    - Cache statistics for 15 minutes (suitable for dashboard)
     *    - Use @Cacheable annotation with key: "teacher_stats_{teacherId}"
     *    - Invalidate cache on:
     *      * New course published
     *      * New review received
     *      * Enrollment status changes
     * 8. Performance optimization:
     *    - Use native SQL queries for complex aggregations
     *    - Implement background job to pre-calculate stats
     *    - Store computed stats in teacher_statistics table
     */
    public TeacherStatsResponse getTeacherStats(Long id) {
        log.info("Fetching statistics for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization
        validateTeacherAccess(teacher);

        // Implementation pending - requires Course, Review, Enrollment entities
        // When entities and repositories are available:
        //
        // Count courses by status:
        // Long totalCourses = courseRepository.countByTeacherId(id);
        // Long publishedCourses = courseRepository.countByTeacherIdAndStatus(id, CourseStatus.PUBLISHED);
        // Long draftCourses = courseRepository.countByTeacherIdAndStatus(id, CourseStatus.DRAFT);
        //
        // Count total students:
        // Long totalStudents = enrollmentRepository.countDistinctStudentsByTeacherId(id);
        //
        // Calculate average rating:
        // Double averageRating = reviewRepository.getAverageRatingByTeacherId(id);
        //
        // Count total reviews:
        // Long totalReviews = reviewRepository.countByTeacherId(id);
        //
        // Calculate total revenue:
        // TeacherRevenueResponse revenue = getTeacherRevenue(id);
        // Double totalRevenue = revenue.getTotalRevenue();

        TeacherStatsResponse stats = TeacherStatsResponse.builder()
                .totalCourses(0L)
                .publishedCourses(0L)
                .draftCourses(0L)
                .totalStudents(0L)
                .totalReviews(0L)
                .averageRating(0.0)
                .totalRevenue(0.0)
                .build();

        log.debug("Returning statistics for teacher id: {}", id);
        log.warn("Statistics calculation pending - requires Course, Review, Enrollment entities and aggregation queries");

        return stats;
    }

    /**
     * Delete teacher (Admin only)
     * - Soft delete by setting account status to DEACTIVATED
     */
    @Transactional
    public void deleteTeacher(Long id, String ipAddress) {
        log.info("Deleting teacher id: {}", id);

        Teacher teacher = teacherRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Use AccountService to handle account deactivation with proper logging
        accountService.deleteAccountById(teacher.getAccount().getId(), ipAddress);

        log.info("Teacher id: {} deleted successfully", id);
    }

    /**
     * Validate teacher access - ensures teacher can only access their own data
     * Throws UnauthorizedException if access denied
     *
     * Used by methods that require teacher to access only their own profile
     * (not used for admin access checks - use validateTeacherOwnershipOrAdmin instead)
     */
    public void validateTeacherAccess(Teacher teacher) {
        Account currentAccount = accountService.validateCurrentAccountByRole(Role.TEACHER);

        if (!teacher.getAccount().getId().equals(currentAccount.getId())) {
            throw new UnauthorizedException("Teachers can only access their own data");
        }

        // Access granted - return normally
    }

    /**
     * Validate teacher ownership or admin role
     */
    public void validateTeacherOwnershipOrAdmin(Teacher teacher) {
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account currentAccount = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current account not found"));

        // ADMIN can access any teacher
        if (currentAccount.getRole() == Role.ADMIN) {
            return;
        }

        // TEACHER can only access their own data
        if (currentAccount.getRole() == Role.TEACHER) {
            if (!teacher.getAccount().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Teachers can only access their own data");
            }
            return;
        }

        throw new UnauthorizedException("Access denied");
    }
}
