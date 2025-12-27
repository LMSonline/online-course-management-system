package vn.uit.lms.controller.auth;

import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.AccountActionRequest;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.account.UpdateProfileRequest;
import vn.uit.lms.shared.dto.request.account.UpdateStatusRequest;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.dto.response.account.AccountResponse;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.log.AccountActionLogResponse;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.util.JsonViewUtils;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.ApiMessage;
import vn.uit.lms.shared.util.annotation.Authenticated;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Account Management", description = "APIs for managing user accounts and profiles")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;
    private final static Logger log = LoggerFactory.getLogger(AccountController.class);

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @Operation(
            summary = "Get current user profile",
            description = "Retrieve the profile information of the currently authenticated user"
    )
    @GetMapping("/accounts/me")
    @ApiMessage("Get profile of the authenticated user")
    @Authenticated
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> getProfile() {

        AccountProfileResponse response = accountService.getProfile();

        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(response));
    }

    @Operation(
            summary = "Upload user avatar",
            description = "Upload a new avatar image for the authenticated user. Accepts JPG, PNG, and WEBP formats."
    )
    @PostMapping(value = "/accounts/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Upload avatar for authenticated user")
    @Authenticated
    public ResponseEntity<UploadAvatarResponse> uploadAvatar(
            @Parameter(description = "Avatar image file (JPG, PNG, WEBP)", required = true)
            @RequestParam("file") MultipartFile file) {

        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));

        UploadAvatarResponse res = accountService.uploadAvatar(file, email);

        return ResponseEntity.ok(res);
    }

    @Operation(
            summary = "Update user profile",
            description = "Update profile information for the currently authenticated user"
    )
    @PutMapping("/accounts/me")
    @ApiMessage("Update profile for authenticated user")
    @Authenticated
    public ResponseEntity<AccountProfileResponse> updateProfile(
            @Parameter(description = "Updated profile information", required = true)
            @Valid @RequestBody UpdateProfileRequest profileRequest) {
        AccountProfileResponse res = accountService.updateProfile(profileRequest);
        return ResponseEntity.ok(res);

    }

    @Operation(
            summary = "Get all accounts (Admin only)",
            description = "Retrieve a paginated list of all user accounts with filtering support. Only accessible by administrators."
    )
    @GetMapping("/admin/accounts")
    @ApiMessage("Get all accounts (Admin only)")
    @AdminOnly
    public ResponseEntity<PageResponse<AccountResponse>> getAllAccounts(
            @Parameter(description = "Filter specification for accounts", hidden = true)
            @Filter Specification<Account> spec,
            @Parameter(description = "Pagination parameters")
            Pageable pageable
            ) {
        PageResponse<AccountResponse> res = accountService.getAllAccounts(spec, pageable);
        return ResponseEntity.ok(res);
    }

    @Operation(
            summary = "Get account by ID (Admin only)",
            description = "Retrieve detailed information about a specific account by its ID. Only accessible by administrators."
    )
    @GetMapping("/admin/accounts/{id}")
    @ApiMessage("Get account by ID (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> getAccountById(
            @Parameter(description = "ID of the account to retrieve", required = true)
            @PathVariable Long id
    ) {
        AccountProfileResponse res = accountService.getAccountById(id);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @Operation(
            summary = "Approve teacher account (Admin only)",
            description = "Approve a pending teacher account and activate it. Only accessible by administrators."
    )
    @PatchMapping("/admin/accounts/{id}/approve")
    @ApiMessage("Approve teacher account (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> approveTeacherAccount(
            @Parameter(description = "ID of the teacher account to approve", required = true)
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.approveTeacherAccount(id, ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @Operation(
            summary = "Reject teacher account (Admin only)",
            description = "Reject a pending teacher account with a reason. Only accessible by administrators."
    )

    @PatchMapping("/admin/accounts/{id}/reject")
    @ApiMessage("Reject teacher account (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> rejectTeacherAccount(
            @Parameter(description = "ID of the teacher account to reject", required = true)
            @PathVariable Long id,
            @Parameter(description = "Rejection details including reason", required = true)
            @Valid @RequestBody RejectRequest rejectRequest,
            HttpServletRequest request
            ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse result = accountService.rejectTeacherAccount(id, rejectRequest.getReason(), ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(result));
    }

    @Operation(
            summary = "Change account status (Admin only)",
            description = "Update the status of an account (e.g., ACTIVE, SUSPENDED, DEACTIVATED). Only accessible by administrators."
    )
    @PatchMapping("/admin/accounts/{id}/status")
    @ApiMessage("Change account status (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> changeAccountStatus(
            @Parameter(description = "ID of the account to update", required = true)
            @PathVariable Long id,
            @Parameter(description = "New status and reason for change", required = true)
            @Valid @RequestBody UpdateStatusRequest statusRequest,
            HttpServletRequest request
            ){
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.changeAccountStatus(id, statusRequest.getStatus(), statusRequest.getReason(), ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @Operation(
            summary = "Suspend account (Admin only)",
            description = "Suspend an active account with optional reason. Only accessible by administrators."
    )
    @PostMapping("/admin/accounts/{id}/suspend")
    @ApiMessage("Suspend account (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> suspendAccount(
            @Parameter(description = "ID of the account to suspend", required = true)
            @PathVariable Long id,
            @Parameter(description = "Suspension details including reason")
            @Valid @RequestBody AccountActionRequest actionRequest,
            HttpServletRequest request
    ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.suspendAccount(id,
                actionRequest != null ? actionRequest.getReason() : null, ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @Operation(
            summary = "Unlock suspended account (Admin only)",
            description = "Unlock a suspended account with optional reason. Only accessible by administrators."
    )
    @PostMapping("/admin/accounts/{id}/unlock")
    @ApiMessage("Unlock account (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> unlockAccount(
            @Parameter(description = "ID of the account to unlock", required = true)
            @PathVariable Long id,
            @Parameter(description = "Unlock details including reason")
            @Valid @RequestBody AccountActionRequest actionRequest,
            HttpServletRequest request
    ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.unlockAccount(id,
                actionRequest != null ? actionRequest.getReason() : null, ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @Operation(
            summary = "Deactivate account (Admin only)",
            description = "Deactivate an active account with optional reason. Only accessible by administrators."
    )
    @PostMapping("/admin/accounts/{id}/deactivate")
    @ApiMessage("Deactivate account (Admin only)")
    @AdminOnly
    public ResponseEntity<vn.uit.lms.shared.dto.ApiResponse<Object>> deactivateAccount(
            @Parameter(description = "ID of the account to deactivate", required = true)
            @PathVariable Long id,
            @Parameter(description = "Deactivation details including reason")
            @Valid @RequestBody AccountActionRequest actionRequest,
            HttpServletRequest request
    ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        AccountProfileResponse res = accountService.deactivateAccount(id,
                actionRequest != null ? actionRequest.getReason() : null, ip);
        return ResponseEntity.ok(JsonViewUtils.formatAccountProfileResponse(res));
    }

    @Operation(
            summary = "Get account activity logs (Admin only)",
            description = "Retrieve paginated activity logs for a specific account with optional filtering by action type. Only accessible by administrators."
    )
    @GetMapping("/admin/accounts/{id}/logs")
    @ApiMessage("Get account activity logs by ID (Admin only)")
    @AdminOnly
    public ResponseEntity<PageResponse<AccountActionLogResponse>> getAccountActivityLogs(
            @Parameter(description = "ID of the account", required = true)
            @PathVariable Long id,
            @Parameter(description = "Filter by action type (optional)")
            @RequestParam(required = false) AccountActionType actionType,
            @Parameter(description = "Pagination parameters")
            Pageable pageable
            ){
        PageResponse<AccountActionLogResponse> res = accountService.getAccountActivityLogs(id, actionType, pageable);
        return ResponseEntity.ok(res);
    }


    @Operation(
            summary = "Delete account (Admin only)",
            description = "Permanently delete an account by its ID. This action is irreversible. Only accessible by administrators."
    )
    @DeleteMapping("/admin/accounts/{id}" )
    @ApiMessage("Delete account by ID (Admin only)")
    @AdminOnly
    public ResponseEntity<Void> deleteAccountById(
            @Parameter(description = "ID of the account to delete", required = true)
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For")).orElse(request.getRemoteAddr());
        accountService.deleteAccountById(id, ip);
        return ResponseEntity.noContent().build();
    }






}
