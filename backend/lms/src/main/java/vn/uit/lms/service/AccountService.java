package vn.uit.lms.service;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.exception.InvalidFileException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.mapper.StudentMapper;
import vn.uit.lms.shared.mapper.TeacherMapper;
import vn.uit.lms.shared.util.CloudinaryUtils;
import vn.uit.lms.shared.util.SecurityUtils;

import java.util.Set;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final CloudinaryUtils cloudinaryUtils;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    @Value("${app.avatar.max-size-bytes}")
    private long maxSizeBytes;

    public AccountService(AccountRepository accountRepository,
                          StudentRepository studentRepository,
                          TeacherRepository teacherRepository,
                          CloudinaryStorageService cloudinaryStorageService,
                          CloudinaryUtils cloudinaryUtils) {
        this.cloudinaryStorageService = cloudinaryStorageService;
        this.accountRepository = accountRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.cloudinaryUtils = cloudinaryUtils;
    }

    public AccountProfileResponse getProfile() {

        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated") {
                });

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        AccountProfileResponse accountProfileResponse = new AccountProfileResponse();
        accountProfileResponse.setAccountId(account.getId());
        accountProfileResponse.setUsername(account.getUsername());
        accountProfileResponse.setEmail(account.getEmail());
        accountProfileResponse.setLastLoginAt(account.getLastLoginAt());
        accountProfileResponse.setRole(account.getRole());
        accountProfileResponse.setStatus(account.getStatus());
        accountProfileResponse.setAvatarUrl(account.getAvatarUrl());

        AccountProfileResponse.Profile profile  = new AccountProfileResponse.Profile();

        profile = switch (account.getRole()) {
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
            case ADMIN -> null;
        };

        accountProfileResponse.setProfile(profile);
        return accountProfileResponse;
    }

    @Transactional
    public UploadAvatarResponse uploadAvatar(MultipartFile file, String currentUserEmail) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Only JPG, PNG, WEBP are allowed");
        }

        if (file.getSize() > maxSizeBytes) {
            throw new InvalidFileException("File size exceeds 5MB");
        }

        Account account = accountRepository.findOneByEmailIgnoreCase(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        String avatarPublicId = account.getAvatarPublicId();
        Long userId = account.getId();

        // Upload to Cloudinary (overwrite with predictable public_id)
        CloudinaryStorageService.UploadResult result =
                cloudinaryStorageService.uploadAvatar(file, userId, avatarPublicId);

        // Delete old image if public id changed and exists
        String oldPublicId = account.getAvatarPublicId();
        if (oldPublicId != null && !oldPublicId.equals(result.getPublicId())) {
            cloudinaryStorageService.deleteByPublicId(oldPublicId);
        }

        // Update DB
        account.setAvatarUrl(result.getUrl());
        account.setAvatarPublicId(result.getPublicId());
        accountRepository.save(account);

        UploadAvatarResponse uploadAvatarResponse = new UploadAvatarResponse();
        uploadAvatarResponse.setAvatarUrl(result.getUrl());
        String thumbnailUrl = cloudinaryUtils.getThumbnailUrl(result.getPublicId(), 200, 200);
        uploadAvatarResponse.setThumbnailUrl(thumbnailUrl);

        return uploadAvatarResponse;
    }

}
