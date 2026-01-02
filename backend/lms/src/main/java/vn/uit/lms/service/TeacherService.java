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

        // TODO: Implement approval request workflow
        // - Create ApprovalRequest entity to track request
        // - Send notification to admin
        // - Set pending approval status
        // - Validate teacher profile is complete (specialty, degree, etc.)

        log.info("Approval request submitted for teacher id: {}", id);
        log.warn("TODO: Implement full approval request workflow");

        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Approve teacher (Admin only)
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

        // TODO: Send approval notification email to teacher
        log.warn("TODO: Send approval notification email");

        log.info("Teacher id: {} approved successfully by admin id: {}", id, currentUserId);
        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Reject teacher (Admin only)
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

        // TODO: Send rejection notification email to teacher with reason
        log.warn("TODO: Send rejection notification email");

        log.info("Teacher id: {} rejected by admin id: {}", id, currentUserId);
        return TeacherMapper.toTeacherDetailResponse(teacher);
    }

    /**
     * Get teacher's courses
     * - TEACHER: Can only view their own courses
     * - ADMIN: Can view any teacher's courses
     * - STUDENT: Can view approved teacher's published courses
     *
     * TODO: Implement course query
     * - Query courses by teacher ID
     * - Include course status, enrollment count, rating
     * - Add filters: status (DRAFT, PUBLISHED, ARCHIVED), search
     * - Sort by: creation date, enrollment count, rating
     */
    public PageResponse<CourseResponse> getTeacherCourses(Long id, Pageable pageable) {
        log.info("Fetching courses for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization
        validateTeacherAccess(teacher);

        // TODO: Implement actual course query when Course relationship is ready
        // Page<Course> coursePage = courseRepository.findByTeacher(teacher, pageable);
        // List<CourseResponse> courses = coursePage.getContent().stream()
        //     .map(CourseMapper::toCourseResponse)
        //     .toList();

        List<CourseResponse> courses = new ArrayList<>();
        Page<CourseResponse> page = new PageImpl<>(courses, pageable, 0);

        log.warn("TODO: Implement course query for teacher");

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
     * TODO: Implement student enrollment query
     * - Query distinct students enrolled in teacher's courses
     * - Include enrollment count per student
     * - Add filters: course, enrollment status, search
     * - Include student progress statistics
     */
    public PageResponse<StudentResponse> getTeacherStudents(Long id, Pageable pageable) {
        log.info("Fetching students for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization - only teacher themselves or admin
        validateTeacherOwnershipOrAdmin(teacher);

        // TODO: Implement actual student enrollment query
        // - Query enrollments for teacher's courses
        // - Get distinct students
        // - Include enrollment statistics

        List<StudentResponse> students = new ArrayList<>();
        Page<StudentResponse> page = new PageImpl<>(students, pageable, 0);

        log.warn("TODO: Implement student enrollment query for teacher");

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
     * TODO: Implement revenue calculation
     * - Calculate total revenue from course enrollments
     * - Break down by course
     * - Calculate monthly/yearly revenue
     * - Include enrollment counts
     * - Add date range filters
     */
    public TeacherRevenueResponse getTeacherRevenue(Long id) {
        log.info("Fetching revenue for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization - only teacher themselves or admin
        validateTeacherOwnershipOrAdmin(teacher);

        // TODO: Implement actual revenue calculation
        // - Query enrollments with payment information
        // - Calculate total revenue
        // - Break down by time period and course
        // - Consider platform fees/commission

        TeacherRevenueResponse response = TeacherRevenueResponse.builder()
                .totalRevenue(0.0)
                .monthlyRevenue(0.0)
                .yearlyRevenue(0.0)
                .totalEnrollments(0L)
                .monthlyEnrollments(0L)
                .revenueByCourse(new ArrayList<>())
                .lastUpdated(Instant.now())
                .build();

        log.warn("TODO: Implement revenue calculation for teacher");

        return response;
    }

    /**
     * Get teacher statistics
     * - TEACHER: Can view their own stats
     * - ADMIN: Can view any teacher's stats
     *
     * TODO: Implement statistics calculation
     * - Count courses by status
     * - Count total students
     * - Calculate average rating
     * - Count total reviews
     * - Add caching for performance
     */
    public TeacherStatsResponse getTeacherStats(Long id) {
        log.info("Fetching statistics for teacher id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        // Check authorization
        validateTeacherAccess(teacher);

        // TODO: Implement actual statistics calculation
        TeacherStatsResponse stats = TeacherStatsResponse.builder()
                .totalCourses(0L)
                .publishedCourses(0L)
                .draftCourses(0L)
                .totalStudents(0L)
                .totalReviews(0L)
                .averageRating(0.0)
                .totalRevenue(0.0)
                .build();

        log.warn("TODO: Implement statistics calculation for teacher");

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
     * Validate if current user has access to view teacher data
     */
    /**
     * Validate teacher access - ensures teacher can only access their own data
     * Throws UnauthorizedException if access denied
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
