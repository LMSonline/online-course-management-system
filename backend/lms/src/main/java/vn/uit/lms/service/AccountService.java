package vn.uit.lms.service;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.AccountActionLog;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.service.event.AccountStatusChangeEvent;
import vn.uit.lms.service.storage.CloudinaryStorageService;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.annotation.Audit;
import vn.uit.lms.shared.constant.*;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.UpdateProfileRequest;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.account.AccountResponse;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.log.AccountActionLogResponse;
import vn.uit.lms.shared.exception.*;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.mapper.LogMapper;
import vn.uit.lms.shared.mapper.StudentMapper;
import vn.uit.lms.shared.mapper.TeacherMapper;
import vn.uit.lms.shared.util.CloudinaryUtils;
import vn.uit.lms.shared.util.SecurityUtils;

import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * AccountService - Thin orchestrator following Rich Domain Model pattern
 * <p>
 * This service coordinates account management workflows and delegates business logic to domain entities.
 * Domain entities (Account, Teacher, Student) encapsulate their own behavior and validation rules.
 * </p>
 */
@Service
public class AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountService.class);

    private final AccountRepository accountRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final CloudinaryUtils cloudinaryUtils;
    private final AccountActionLogService accountActionLogService;
    private final MailService mailService;
    private final ApplicationEventPublisher eventPublisher;

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    @Value("${app.avatar.max-size-bytes}")
    private long maxSizeBytes;

    public AccountService(AccountRepository accountRepository,
                          StudentRepository studentRepository,
                          TeacherRepository teacherRepository,
                          CloudinaryStorageService cloudinaryStorageService,
                          CloudinaryUtils cloudinaryUtils,
                          AccountActionLogService accountActionLogService,
                          MailService mailService,
                          ApplicationEventPublisher eventPublisher) {
        this.accountActionLogService = accountActionLogService;
        this.accountRepository = accountRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.cloudinaryStorageService = cloudinaryStorageService;
        this.cloudinaryUtils = cloudinaryUtils;
        this.mailService = mailService;
        this.eventPublisher = eventPublisher;
    }

    public Account verifyCurrentAccount(){
        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Use domain behavior
        account.requireActive();

        return account;
    }

    /**
     * Get current logged-in user's username/email
     * @return username (email)
     */
    public String getCurrentUserLogin() {
        return SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));
    }

    public Account validateCurrentAccountByRole(Role requiredRole) {

       Account account = verifyCurrentAccount();

        // Role-specific validations using domain behaviors
        if (account.isTeacher()) {
            Teacher teacher = teacherRepository.findByAccount(account)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            teacher.requireApproved();
        }
        // Admin validations can be added here if needed

        // Final authorization using domain behavior
        account.requireRole(requiredRole);

        return account;
    }


    /**
     * Retrieve the current logged-in user's profile information.
     */
    public AccountProfileResponse getProfile() {
        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        log.info("Fetching profile for user: {}", email);

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return getAccountProfile(account);
    }

    /**
     * Upload a new avatar for the current user and update the database record.
     * Service orchestrates: validation, upload, deletion, save
     */
    @Transactional
    public UploadAvatarResponse uploadAvatar(MultipartFile file, String currentUserEmail) {
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

        // Fetch account
        Account account = accountRepository.findOneByEmailIgnoreCase(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Long userId = account.getId();
        String oldPublicId = account.getOldAvatarPublicId();

        log.info("Uploading avatar for userId={} (oldPublicId={})", userId, oldPublicId);

        // Upload avatar to Cloudinary
        CloudinaryStorageService.UploadResult uploadResult =
                cloudinaryStorageService.uploadAvatar(file, userId, oldPublicId);

        // Delete old image if a new one is generated
        if (oldPublicId != null && !Objects.equals(oldPublicId, uploadResult.getPublicId())) {
            try {
                cloudinaryStorageService.deleteByPublicId(oldPublicId);
                log.info("Deleted old avatar: {}", oldPublicId);
            } catch (Exception ex) {
                log.warn("Failed to delete old avatar ({}): {}", oldPublicId, ex.getMessage());
            }
        }

        // Update avatar using domain behavior
        account.updateAvatar(uploadResult.getUrl(), uploadResult.getPublicId());
        accountRepository.save(account);

        // Prepare response
        UploadAvatarResponse response = new UploadAvatarResponse();
        response.setAvatarUrl(uploadResult.getUrl());
        response.setThumbnailUrl(cloudinaryUtils.getThumbnailUrl(uploadResult.getPublicId(), 200, 200));

        log.info("Avatar updated successfully for userId={} (newPublicId={})", userId, uploadResult.getPublicId());
        return response;
    }

    /**
     * Update the profile details of the currently logged-in user.
     * Service orchestrates: fetch, validation, profile update, save
     */
    @Transactional
    @Audit(table = "accounts", action = AuditAction.UPDATE)
    public AccountProfileResponse updateProfile(@Valid UpdateProfileRequest req) {
        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        log.info("Updating profile for user: {}", email);

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        AccountProfileResponse.Profile profile = switch (account.getRole()) {
            case STUDENT -> updateStudentProfile(req, account);
            case TEACHER -> updateTeacherProfile(req, account);
            case ADMIN -> {
                log.warn("Attempted to update ADMIN profile — ignored");
                yield new AccountProfileResponse.Profile();
            }
        };

        log.info("Profile updated successfully for user: {}", email);
        return AccountMapper.toProfileResponse(account, profile);
    }

    /**
     * Update Student-specific profile using domain behavior
     */
    private AccountProfileResponse.Profile updateStudentProfile(UpdateProfileRequest req, Account account) {
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Use domain behavior for profile update
        student.updateProfile(req.getFullName(), req.getBio(), req.getGender(), req.getBirthDate(), req.getPhone());
        studentRepository.save(student);

        log.debug("Student profile updated for accountId={}", account.getId());
        return StudentMapper.toProfileResponse(student);
    }

    /**
     * Update Teacher-specific profile using domain behavior
     */
    private AccountProfileResponse.Profile updateTeacherProfile(UpdateProfileRequest req, Account account) {
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        // Use domain behavior for profile update
        teacher.updateProfile(req.getFullName(), req.getBio(), req.getGender(), req.getBirthDate(), req.getPhone());
        teacher.setSpecialty(req.getSpecialty());
        teacher.setDegree(req.getDegree());
        teacherRepository.save(teacher);

        log.debug("Teacher profile updated for accountId={}", account.getId());
        return TeacherMapper.toProfileResponse(teacher);
    }


    public PageResponse<AccountResponse> getAllAccounts(Specification<Account> spec, Pageable pageable) {
        Page<Account> page = accountRepository.findAll(spec, pageable);

        List<AccountResponse> items = page.getContent()
                .stream()
                .map(AccountMapper::toAccountResponse)
                .toList();

        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    public AccountProfileResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return getAccountProfile(account);
    }

    public AccountProfileResponse getAccountProfile(Account account) {
        AccountProfileResponse.Profile profile = switch (account.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                yield StudentMapper.toProfileResponse(student);
            }
            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                yield TeacherMapper.toProfileResponse(teacher);
            }
            case ADMIN -> new AccountProfileResponse.Profile();
        };

        return AccountMapper.toProfileResponse(account, profile);
    }

    /**
     * Approve a teacher account by admin.
     * Service orchestrates: validation, approval, logging, event publishing
     *
     * @param id teacher account ID
     * @return approved teacher profile
     */
    @Transactional
    public AccountProfileResponse approveTeacherAccount(Long id, String ipAddress) {
        log.info("Approving teacher account id={}, ip={}", id, ipAddress);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Validate account is a teacher using domain behavior
        if (!account.isTeacher()) {
            throw new InvalidRequestException("Only teacher accounts can be approved");
        }

        if (account.isPendingEmailVerification()) {
            throw new InvalidStatusException("Teacher has not verified email yet");
        }

        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        // Use domain behaviors for approval
        AccountStatus oldStatus = account.getStatus();
        teacher.approve(adminId);

        teacherRepository.save(teacher);
        accountRepository.save(account);

        // Log action using factory method
        AccountActionLog log = AccountActionLog.createApprovalLog(
                account,
                adminAccount,
                "Teacher account approved by: " + adminAccount.getUsername(),
                ipAddress,
                oldStatus.name(),
                AccountStatus.ACTIVE.name()
        );
        accountActionLogService.saveLog(log);

        // Publish event
        eventPublisher.publishEvent(new AccountStatusChangeEvent(
                account,
                AccountActionType.APPROVE,
                "Teacher account approved by: " + adminAccount.getUsername()
        ));

        AccountProfileResponse.Profile profile = TeacherMapper.toProfileResponse(teacher);
        AccountProfileResponse response = AccountMapper.toProfileResponse(account, profile);

        AccountService.log.info("Teacher account id={} approved successfully by admin={}", id, adminAccount.getUsername());
        return response;
    }

    /**
     * Reject a teacher account by admin.
     * Service orchestrates: validation, rejection, logging, event publishing
     *
     * @param id teacher account ID
     * @return rejected teacher profile
     */
    @Transactional
    public AccountProfileResponse rejectTeacherAccount(Long id, String reason, String ipAddress) {
        log.info("Rejecting teacher account id={}, reason='{}', ip={}", id, reason, ipAddress);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Validate account is a teacher using domain behavior
        if (!account.isTeacher()) {
            throw new InvalidRequestException("Only teacher accounts can be rejected");
        }

        if (account.isPendingEmailVerification()) {
            throw new InvalidStatusException("Teacher has not verified email yet");
        }

        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        // Use domain behaviors for rejection
        AccountStatus oldStatus = account.getStatus();
        teacher.reject(adminId, reason);
        account.reject();

        teacherRepository.save(teacher);
        accountRepository.save(account);

        // Log action using factory method
        AccountActionLog logEntry = AccountActionLog.createRejectionLog(
                account,
                adminAccount,
                reason,
                ipAddress,
                oldStatus.name(),
                AccountStatus.REJECTED.name()
        );
        accountActionLogService.saveLog(logEntry);

        // Publish event
        eventPublisher.publishEvent(new AccountStatusChangeEvent(account, AccountActionType.REJECT, reason));

        AccountProfileResponse.Profile profile = TeacherMapper.toProfileResponse(teacher);
        AccountProfileResponse response = AccountMapper.toProfileResponse(account, profile);

        log.info("Teacher account id={} rejected by admin={} successfully", id, adminAccount.getUsername());
        return response;
    }

    public PageResponse<AccountActionLogResponse> getAccountActivityLogs(Long accountId, AccountActionType actionType,Pageable pageable){
        Page<AccountActionLog> page = accountActionLogService.getLogsForAccount(accountId, actionType, pageable);

        List<AccountActionLogResponse> items = page.getContent()
                .stream()
                .map(LogMapper::toAccountActionLogResponse)
                .toList();

        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Transactional
    public AccountProfileResponse changeAccountStatus(Long accountId, AccountStatus newStatus, String reason, String ip){
        log.info("Changing account status for accountId={}, newStatus={}, ip={}", accountId, newStatus, ip);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Handle teacher-specific approval/rejection
        if(account.isTeacher() && newStatus == AccountStatus.ACTIVE){
            return approveTeacherAccount(accountId, ip);
        }

        if(account.isTeacher() && newStatus == AccountStatus.REJECTED){
            return rejectTeacherAccount(accountId, reason != null ? reason : "No reason provided", ip);
        }

        // Validate admin account changes
        if(account.isAdmin()){
            throw new InvalidRequestException("Cannot change status of ADMIN accounts");
        }

        // Store old status and set new status
        AccountStatus oldStatus = account.getStatus();
        account.setStatus(newStatus);

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        accountRepository.save(account);

        // Map status to action type
        AccountActionType actionType = LogMapper.mapStatusToAction(newStatus, oldStatus);

        // Create and save log using factory method
        AccountActionLog logEntry = AccountActionLog.createStatusChangeLog(
                account,
                adminAccount,
                actionType,
                reason != null ? reason : "Account status changed to: " + newStatus + " by admin: " + adminAccount.getUsername(),
                ip,
                oldStatus.name(),
                newStatus.name()
        );
        accountActionLogService.saveLog(logEntry);

        // Publish event
        eventPublisher.publishEvent(new AccountStatusChangeEvent(
                account,
                actionType,
                reason != null ? reason : "Account status changed to: " + newStatus
        ));

        // Build response based on role
        AccountProfileResponse.Profile profile = switch (account.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                yield StudentMapper.toProfileResponse(student);
            }
            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                yield TeacherMapper.toProfileResponse(teacher);
            }
            case ADMIN -> new AccountProfileResponse.Profile();
        };

        log.info("Account status changed successfully for accountId={} from {} to {}", accountId, oldStatus, newStatus);
        return AccountMapper.toProfileResponse(account, profile);
    }

    /**
     * Suspend an active account.
     * Service orchestrates: validation, suspension, logging, event publishing
     */
    @Transactional
    public AccountProfileResponse suspendAccount(Long accountId, String reason, String ipAddress) {
        log.info("Suspending account id={}, reason='{}', ip={}", accountId, reason, ipAddress);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.isAdmin()) {
            throw new InvalidRequestException("Cannot suspend ADMIN accounts");
        }

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        // Use domain behavior for suspension
        AccountStatus oldStatus = account.getStatus();
        account.suspend();
        accountRepository.save(account);

        // Log action
        AccountActionLog logEntry = AccountActionLog.createStatusChangeLog(
                account,
                adminAccount,
                AccountActionType.SUSPEND,
                reason != null ? reason : "Account suspended by admin: " + adminAccount.getUsername(),
                ipAddress,
                oldStatus.name(),
                AccountStatus.SUSPENDED.name()
        );
        accountActionLogService.saveLog(logEntry);

        // Publish event
        eventPublisher.publishEvent(new AccountStatusChangeEvent(
                account,
                AccountActionType.SUSPEND,
                reason != null ? reason : "Account suspended"
        ));

        AccountProfileResponse.Profile profile = buildAccountProfile(account);
        log.info("Account id={} suspended successfully by admin={}", accountId, adminAccount.getUsername());
        return AccountMapper.toProfileResponse(account, profile);
    }

    /**
     * Unlock a suspended account.
     * Service orchestrates: validation, unlocking, logging, event publishing
     */
    @Transactional
    public AccountProfileResponse unlockAccount(Long accountId, String reason, String ipAddress) {
        log.info("Unlocking account id={}, reason='{}', ip={}", accountId, reason, ipAddress);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.isAdmin()) {
            throw new InvalidRequestException("Cannot unlock ADMIN accounts");
        }

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        // Use domain behavior for unlocking
        AccountStatus oldStatus = account.getStatus();
        account.unlock();
        accountRepository.save(account);

        // Log action
        AccountActionLog logEntry = AccountActionLog.createStatusChangeLog(
                account,
                adminAccount,
                AccountActionType.UNLOCK,
                reason != null ? reason : "Account unlocked by admin: " + adminAccount.getUsername(),
                ipAddress,
                oldStatus.name(),
                AccountStatus.ACTIVE.name()
        );
        accountActionLogService.saveLog(logEntry);

        // Publish event
        eventPublisher.publishEvent(new AccountStatusChangeEvent(
                account,
                AccountActionType.UNLOCK,
                reason != null ? reason : "Account unlocked"
        ));

        AccountProfileResponse.Profile profile = buildAccountProfile(account);
        log.info("Account id={} unlocked successfully by admin={}", accountId, adminAccount.getUsername());
        return AccountMapper.toProfileResponse(account, profile);
    }

    /**
     * Deactivate an active account.
     * Service orchestrates: validation, deactivation, logging, event publishing
     */
    @Transactional
    public AccountProfileResponse deactivateAccount(Long accountId, String reason, String ipAddress) {
        log.info("Deactivating account id={}, reason='{}', ip={}", accountId, reason, ipAddress);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.isAdmin()) {
            throw new InvalidRequestException("Cannot deactivate ADMIN accounts");
        }

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        // Use domain behavior for deactivation
        AccountStatus oldStatus = account.getStatus();
        account.deactivate();
        accountRepository.save(account);

        // Log action
        AccountActionLog logEntry = AccountActionLog.createStatusChangeLog(
                account,
                adminAccount,
                AccountActionType.DEACTIVATE,
                reason != null ? reason : "Account deactivated by admin: " + adminAccount.getUsername(),
                ipAddress,
                oldStatus.name(),
                AccountStatus.DEACTIVATED.name()
        );
        accountActionLogService.saveLog(logEntry);

        // Publish event
        eventPublisher.publishEvent(new AccountStatusChangeEvent(
                account,
                AccountActionType.DEACTIVATE,
                reason != null ? reason : "Account deactivated"
        ));

        AccountProfileResponse.Profile profile = buildAccountProfile(account);
        log.info("Account id={} deactivated successfully by admin={}", accountId, adminAccount.getUsername());
        return AccountMapper.toProfileResponse(account, profile);
    }

    /**
     * Helper method to build account profile based on role
     */
    private AccountProfileResponse.Profile buildAccountProfile(Account account) {
        return switch (account.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                yield StudentMapper.toProfileResponse(student);
            }
            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                yield TeacherMapper.toProfileResponse(teacher);
            }
            case ADMIN -> new AccountProfileResponse.Profile();
        };
    }

    public void deleteAccountById(Long id, String ipAddress) {
        log.info("Deleting account id={}, ip={}", id, ipAddress);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        AccountStatus oldStatus = account.getStatus();
        account.setStatus(AccountStatus.DEACTIVATED);

        accountActionLogService.logAction(
                account.getId(),
                AccountActionType.DEACTIVATE,
                "Account status changed to: " + AccountStatus.DEACTIVATED + " by admin: " + adminAccount.getUsername(),
                adminId,
                ipAddress,
                oldStatus.name(),
                AccountStatus.DEACTIVATED.name()
        );

        eventPublisher.publishEvent(new AccountStatusChangeEvent(account, AccountActionType.DEACTIVATE, "Account status changed to: " + AccountStatus.DEACTIVATED + " by admin: " + adminAccount.getUsername()));

        log.info("Account id={} deleted successfully", id);
    }

}
