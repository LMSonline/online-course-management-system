package vn.uit.lms.service;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.AccountActionLog;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.UpdateProfileRequest;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.account.AccountResponse;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.log.AccountActionLogResponse;
import vn.uit.lms.shared.entity.PersonBase;
import vn.uit.lms.shared.exception.*;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.mapper.LogMapper;
import vn.uit.lms.shared.mapper.StudentMapper;
import vn.uit.lms.shared.mapper.TeacherMapper;
import vn.uit.lms.shared.util.CloudinaryUtils;
import vn.uit.lms.shared.util.SecurityUtils;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Set;

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

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    @Value("${app.avatar.max-size-bytes}")
    private long maxSizeBytes;

    public AccountService(AccountRepository accountRepository,
                          StudentRepository studentRepository,
                          TeacherRepository teacherRepository,
                          CloudinaryStorageService cloudinaryStorageService,
                          CloudinaryUtils cloudinaryUtils,
                          AccountActionLogService accountActionLogService,
                          MailService mailService) {
        this.accountActionLogService = accountActionLogService;
        this.accountRepository = accountRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.cloudinaryStorageService = cloudinaryStorageService;
        this.cloudinaryUtils = cloudinaryUtils;
        this.mailService = mailService;
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
     */
    @Transactional
    public UploadAvatarResponse uploadAvatar(MultipartFile file, String currentUserEmail) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Only JPG, PNG, WEBP are allowed");
        }

        if (file.getSize() > maxSizeBytes) {
            throw new InvalidFileException("File size exceeds " + (maxSizeBytes / 1024 / 1024) + "MB");
        }

        Account account = accountRepository.findOneByEmailIgnoreCase(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Long userId = account.getId();
        String oldPublicId = account.getAvatarPublicId();

        log.info("Uploading avatar for userId={} (oldPublicId={})", userId, oldPublicId);

        // Upload avatar to Cloudinary (overwrite if existing)
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

        // Update avatar info in DB
        account.setAvatarUrl(uploadResult.getUrl());
        account.setAvatarPublicId(uploadResult.getPublicId());
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
     */
    @Transactional
    public AccountProfileResponse updateProfile(@Valid UpdateProfileRequest req) {
        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        log.info("Updating profile for user: {}", email);

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new InvalidFileException("Full name cannot be empty");
        }

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
     * Update Student-specific profile information.
     */
    private AccountProfileResponse.Profile updateStudentProfile(UpdateProfileRequest req, Account account) {
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        updateCommonProfile(req, student);
        studentRepository.save(student);

        log.debug("Student profile updated for accountId={}", account.getId());
        return StudentMapper.toProfileResponse(student);
    }

    /**
     * Update Teacher-specific profile information.
     */
    
    private AccountProfileResponse.Profile updateTeacherProfile(UpdateProfileRequest req, Account account) {
        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        updateCommonProfile(req, teacher);
        teacher.setSpecialty(req.getSpecialty());
        teacher.setDegree(req.getDegree());
        teacherRepository.save(teacher);

        log.debug("Teacher profile updated for accountId={}", account.getId());
        return TeacherMapper.toProfileResponse(teacher);
    }

    /**
     * Apply common profile updates for both Student and Teacher.
     */
    private void updateCommonProfile(UpdateProfileRequest req, PersonBase person) {
        person.setFullName(req.getFullName());
        person.setBio(req.getBio());
        person.setGender(req.getGender());
        person.setBirthDate(req.getBirthDate());
        person.setPhone(req.getPhone());
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
     *
     * @param id teacher account ID
     * @return approved teacher profile
     */
    @Transactional
    public AccountProfileResponse approveTeacherAccount(Long id, String ipAddress) {
        log.info("Approving teacher account id={}, ip={}", id, ipAddress);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.getRole() != Role.TEACHER) {
            throw new InvalidRequestException("Only teacher accounts can be approved");
        }

        if (account.getStatus() != AccountStatus.PENDING_APPROVAL) {
            throw new InvalidStatusException("Teacher is not pending approval");
        }

        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        teacher.setApproved(true);
        teacher.setApprovedAt(Instant.now());
        teacher.setApprovedBy(adminId);
        teacher.setRejectReason(null);

        account.setStatus(AccountStatus.ACTIVE);

        teacherRepository.save(teacher);
        accountRepository.save(account);


        accountActionLogService.logAction(
                account.getId(),
                AccountActionType.APPROVE,
                "Teacher account approved by: " + adminAccount.getUsername(),
                adminId,
                ipAddress,
                AccountStatus.PENDING_APPROVAL.name(),
                AccountStatus.ACTIVE.name()
        );

        mailService.sendTeacherNotification(
                account.getId(),
                AccountActionType.APPROVE,
                null
        );

        AccountProfileResponse.Profile profile = TeacherMapper.toProfileResponse(teacher);
        AccountProfileResponse response = AccountMapper.toProfileResponse(account, profile);

        log.info("Teacher account id={} approved successfully by admin={}", id, adminAccount.getUsername());
        return response;
    }

    /**
     * Reject a teacher account by admin.
     *
     * @param id teacher account ID
     * @return rejected teacher profile
     */
    @Transactional
    public AccountProfileResponse rejectTeacherAccount(Long id, String reason, String ipAddress) {
        log.info("Rejecting teacher account id={}, reason='{}', ip={}", id, reason, ipAddress);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.getRole() != Role.TEACHER) {
            throw new InvalidRequestException("Only teacher accounts can be rejected");
        }

        if (account.getStatus() != AccountStatus.PENDING_APPROVAL) {
            throw new InvalidStatusException("Teacher is not pending approval");
        }

        Teacher teacher = teacherRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        teacher.setApproved(false);
        teacher.setApprovedAt(Instant.now());
        teacher.setApprovedBy(adminId);
        teacher.setRejectReason(reason);

        account.setStatus(AccountStatus.REJECTED);

        teacherRepository.save(teacher);
        accountRepository.save(account);

        accountActionLogService.logAction(
                account.getId(),
                AccountActionType.REJECT,
                reason,
                adminId,
                ipAddress,
                AccountStatus.PENDING_APPROVAL.name(),
                AccountStatus.REJECTED.name()
        );

        mailService.sendTeacherNotification(
                account.getId(),
                AccountActionType.REJECT,
                reason
        );

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
    public AccountProfileResponse changeAccountStatus(Long accountId, AccountStatus newStatus, String ip){
        log.info("Changing account status for accountId={}, newStatus={}, ip={}", accountId, newStatus, ip);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if(account.getRole() == Role.ADMIN){
            throw new InvalidRequestException("Cannot change status of ADMIN accounts");
        }

        AccountStatus oldStatus =  account.getStatus();

        Long adminId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        Account adminAccount = accountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        account.setStatus(newStatus);
        accountRepository.save(account);

        AccountActionType actionType = LogMapper.mapStatusToAction(newStatus, oldStatus);

        accountActionLogService.logAction(
                account.getId(),
                actionType,
                "Account status changed to: " + newStatus + " by admin: " + adminAccount.getUsername(),
                adminId,
                ip,
                oldStatus.name(),
                newStatus.name()
        );

        AccountProfileResponse response = getAccountProfile(account);

        log.info("Account status for accountId={} changed from {} to {} by admin={}", accountId, oldStatus, newStatus, adminAccount.getUsername());
        return response;
    }

}
