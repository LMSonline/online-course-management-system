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
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.service.storage.CloudinaryStorageService;
import vn.uit.lms.shared.annotation.Audit;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.AuditAction;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.student.UpdateStudentRequest;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.student.*;
import vn.uit.lms.shared.exception.*;
import vn.uit.lms.shared.mapper.StudentMapper;
import vn.uit.lms.shared.util.CloudinaryUtils;
import vn.uit.lms.shared.util.SecurityUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentService.class);
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final StudentRepository studentRepository;
    private final AccountRepository accountRepository;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final CloudinaryUtils cloudinaryUtils;
    private final AccountService accountService;

    @Value("${app.avatar.max-size-bytes}")
    private long maxSizeBytes;

    public StudentService(StudentRepository studentRepository,
                          AccountRepository accountRepository,
                          CloudinaryStorageService cloudinaryStorageService,
                          CloudinaryUtils cloudinaryUtils,
                          AccountService accountService) {
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.cloudinaryStorageService = cloudinaryStorageService;
        this.cloudinaryUtils = cloudinaryUtils;
        this.accountService = accountService;
    }

    /**
     * Get student by ID
     * - STUDENT: Can only view their own profile
     * - TEACHER: Can view students enrolled in their courses (TODO: add enrollment check)
     * - ADMIN: Can view any student
     */
    public StudentDetailResponse getStudentById(Long id) {
        log.info("Fetching student by id: {}", id);

        Student student = studentRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check authorization
        validateStudentAccess(student);

        return StudentMapper.toStudentDetailResponse(student);
    }

    /**
     * Get student by student code
     * - STUDENT: Can only view their own profile
     * - TEACHER: Can view students enrolled in their courses (TODO: add enrollment check)
     * - ADMIN: Can view any student
     */
    public StudentDetailResponse getStudentByCode(String code) {
        log.info("Fetching student by code: {}", code);

        Student student = studentRepository.findByStudentCodeWithAccount(code)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + code));

        // Check authorization
        validateStudentAccess(student);

        return StudentMapper.toStudentDetailResponse(student);
    }

    /**
     * Update student information
     * - STUDENT: Can only update their own profile
     * - ADMIN: Can update any student
     */
    @Transactional
    @Audit(table = "students", action = AuditAction.UPDATE)
    public StudentDetailResponse updateStudent(Long id, UpdateStudentRequest request) {
        log.info("Updating student id: {}", id);

        Student student = studentRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check account is active
        if (student.getAccount().getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidStatusException("Cannot update inactive student account");
        }

        // Check authorization
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account currentAccount = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current account not found"));

        // STUDENT can only update their own profile
        if (currentAccount.getRole() == Role.STUDENT) {
            if (!student.getAccount().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Students can only update their own profile");
            }
        }

        // Validate unique student code if changed
        if (request.getStudentCode() != null &&
            !request.getStudentCode().equals(student.getStudentCode())) {
            if (studentRepository.findByStudentCode(request.getStudentCode()).isPresent()) {
                throw new InvalidRequestException("Student code already exists: " + request.getStudentCode());
            }
            student.setStudentCode(request.getStudentCode());
        }

        // Update student information
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            student.setFullName(request.getFullName());
        }
        if (request.getBirthDate() != null) {
            student.setBirthDate(request.getBirthDate());
        }
        if (request.getGender() != null) {
            student.setGender(request.getGender());
        }
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            student.setBio(request.getBio());
        }

        student = studentRepository.save(student);

        log.info("Student id: {} updated successfully", id);
        return StudentMapper.toStudentDetailResponse(student);
    }

    /**
     * Upload avatar for student
     * - STUDENT: Can only upload their own avatar
     */
    @Transactional
    public UploadAvatarResponse uploadStudentAvatar(Long id, MultipartFile file) {
        log.info("Uploading avatar for student id: {}", id);

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

        Student student = studentRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check account is active
        if (student.getAccount().getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidStatusException("Cannot update avatar for inactive student account");
        }

        // Check authorization - STUDENT can only upload their own avatar
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        if (!student.getAccount().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Students can only update their own avatar");
        }

        Account account = student.getAccount();
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

        log.info("Avatar uploaded successfully for student id: {}", id);
        return response;
    }

    /**
     * Get student's enrolled courses
     * - STUDENT: Can only view their own courses
     * - TEACHER: Can view students enrolled in their courses (TODO: add enrollment check)
     * - ADMIN: Can view any student's courses
     */
    public PageResponse<StudentCourseResponse> getStudentCourses(Long id, Pageable pageable) {
        log.info("Fetching courses for student id: {}", id);

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check authorization
        validateStudentAccess(student);

        // TODO: Implement actual enrollment query when Enrollment entity is created
        // For now, return empty list
        List<StudentCourseResponse> courses = new ArrayList<>();
        Page<StudentCourseResponse> page = new PageImpl<>(courses, pageable, 0);

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
     * Get student's learning progress
     * - STUDENT: Can only view their own progress
     * - TEACHER: Can view students enrolled in their courses (TODO: add enrollment check)
     * - ADMIN: Can view any student's progress
     */
    public StudentProgressResponse getStudentProgress(Long id) {
        log.info("Fetching progress for student id: {}", id);

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check authorization
        validateStudentAccess(student);

        // TODO: Implement actual progress calculation when Enrollment/Progress entities are created
        // For now, return empty progress
        return StudentProgressResponse.builder()
                .totalEnrolledCourses(0L)
                .completedCourses(0L)
                .inProgressCourses(0L)
                .totalCertificates(0L)
                .totalLearningHours(0.0)
                .averageProgressPercentage(0.0)
                .lastActivityAt(null)
                .totalAssignmentsSubmitted(0L)
                .totalAssessmentsCompleted(0L)
                .build();
    }

    /**
     * Get student's certificates
     * - STUDENT: Can only view their own certificates
     * - TEACHER: Can view certificates for their courses (TODO: add enrollment check)
     * - ADMIN: Can view any student's certificates
     */
    public PageResponse<StudentCertificateResponse> getStudentCertificates(Long id, Pageable pageable) {
        log.info("Fetching certificates for student id: {}", id);

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check authorization
        validateStudentAccess(student);

        // TODO: Implement actual certificate query when Certificate entity is created
        // For now, return empty list
        List<StudentCertificateResponse> certificates = new ArrayList<>();
        Page<StudentCertificateResponse> page = new PageImpl<>(certificates, pageable, 0);

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
     * Delete student (Admin only)
     * - Soft delete by setting account status to DEACTIVATED
     */
    @Transactional
    public void deleteStudent(Long id, String ipAddress) {
        log.info("Deleting student id: {}", id);

        Student student = studentRepository.findByIdWithAccount(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Use AccountService to handle account deactivation with proper logging
        accountService.deleteAccountById(student.getAccount().getId(), ipAddress);

        log.info("Student id: {} deleted successfully", id);
    }

    /**
     * Validate if current user has access to view/modify student data
     */
    private void validateStudentAccess(Student student) {
        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account currentAccount = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current account not found"));

        // ADMIN can access any student
        if (currentAccount.getRole() == Role.ADMIN) {
            return;
        }

        // STUDENT can only access their own data
        if (currentAccount.getRole() == Role.STUDENT) {
            if (!student.getAccount().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Students can only access their own data");
            }
            return;
        }

        // TEACHER can access students enrolled in their courses
        if (currentAccount.getRole() == Role.TEACHER) {
            // TODO: Add enrollment check when Enrollment entity is created
            // For now, allow teacher access
            return;
        }

        throw new UnauthorizedException("Access denied");
    }
}


