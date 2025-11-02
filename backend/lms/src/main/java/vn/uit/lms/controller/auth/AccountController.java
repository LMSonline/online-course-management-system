package vn.uit.lms.controller.auth;

import com.turkraft.springfilter.boot.Filter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.AccountActionLog;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.account.UpdateProfileRequest;
import vn.uit.lms.shared.dto.request.account.UpdateStatusRequest;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.account.AccountResponse;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.log.AccountActionLogResponse;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.util.CloudinaryUtils;
import vn.uit.lms.shared.util.JsonViewUtils;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.ApiMessage;
import vn.uit.lms.shared.view.Views;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;
    private final static Logger log = LoggerFactory.getLogger(AccountController.class);

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/me")
    @ApiMessage("Get profile of the authenticated user")
    public ResponseEntity<ApiResponse<Object>> getProfile() {

        AccountProfileResponse response = accountService.getProfile();

        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(response));
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Upload avatar for authenticated user")
    public ResponseEntity<UploadAvatarResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file) {

        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        UploadAvatarResponse res = accountService.uploadAvatar(file, email);

        return ResponseEntity.ok(res);
    }

    @PutMapping("/me")
    @ApiMessage("Update profile for authenticated user")
    public ResponseEntity<AccountProfileResponse> updateProfile(
         @Valid @RequestBody UpdateProfileRequest profileRequest) {
        AccountProfileResponse res = accountService.updateProfile(profileRequest);
        return ResponseEntity.ok(res);

    }

    @GetMapping
    @ApiMessage("Get all accounts (Admin only)")
    @AdminOnly
    public ResponseEntity<PageResponse<AccountResponse>> getAllAccounts(
            @Filter Specification<Account> spec,
            Pageable pageable
            ) {
        PageResponse<AccountResponse> res = accountService.getAllAccounts(spec, pageable);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get account by ID (Admin only)")
    @AdminOnly
    public ResponseEntity<ApiResponse<Object>> getAccountById(
            @PathVariable Long id
    ) {
        AccountProfileResponse res = accountService.getAccountById(id);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @PatchMapping("/teacher/{id}/approve")
    @ApiMessage("Approve teacher account (Admin only)")
    @AdminOnly
    public ResponseEntity<ApiResponse<Object>> approveTeacherAccount(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.approveTeacherAccount(id, ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @PatchMapping("/teacher/{id}/reject")
    @ApiMessage("Reject teacher account (Admin only)")
    @AdminOnly
    public ResponseEntity<ApiResponse<Object>> rejectTeacherAccount(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest rejectRequest,
            HttpServletRequest request
            ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse result = accountService.rejectTeacherAccount(id, rejectRequest.getReason(), ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(result));
    }

    @PatchMapping("{id}/status")
    @ApiMessage("Change account status (Admin only)")
    @AdminOnly
    public ResponseEntity<ApiResponse<Object>> changeAccountStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest statusRequest,
            HttpServletRequest request
            ){
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.changeAccountStatus(id, statusRequest.getStatus(), ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @GetMapping("/{id}/logs")
    @ApiMessage("Get account activity logs by ID (Admin only)")
    @AdminOnly
    public ResponseEntity<PageResponse<AccountActionLogResponse>> getAccountActivityLogs(
            @PathVariable Long id,
            @RequestParam(required = false)AccountActionType actionType,
            Pageable pageable
            ){
        PageResponse<AccountActionLogResponse> res = accountService.getAccountActivityLogs(id, actionType, pageable);
        return ResponseEntity.ok(res);
    }







}
