package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Language;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.exception.InvalidPasswordException;
import vn.uit.lms.shared.exception.InvalidStatusException;
import vn.uit.lms.shared.exception.UnauthorizedException;

import java.time.Instant;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@SQLDelete(sql = "UPDATE accounts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class Account extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false, unique = true)
    private String username;

    @Column(length = 255, nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private AccountStatus status = AccountStatus.PENDING_EMAIL;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(name = "avatar_public_id", length = 255)
    private String avatarPublicId;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Size(min = 2, max = 10)
    @Column(name = "lang_key", length = 10)
    private String langKey = Language.VI.getCode();


    /**
     * Check if account is pending email verification
     */
    public boolean isPendingEmailVerification() {
        return this.status == AccountStatus.PENDING_EMAIL;
    }

    /**
     * Check if account is active
     */
    public boolean isActive() {
        return this.status == AccountStatus.ACTIVE;
    }



    /**
     * Activate account after email verification
     */
    public void activate() {
        if (this.status != AccountStatus.PENDING_EMAIL && this.status != AccountStatus.PENDING_APPROVAL) {
            throw new InvalidStatusException("Cannot activate account in status: " + this.status);
        }
        this.status = AccountStatus.ACTIVE;
    }

    /**
     * Set account to pending approval status (for teachers)
     */
    public void setPendingApproval() {
        if (this.status != AccountStatus.PENDING_EMAIL) {
            throw new InvalidStatusException("Can only set pending approval from pending email status");
        }
        this.status = AccountStatus.PENDING_APPROVAL;
    }

    /**
     * Change password with validation
     */
    public void changePassword(String oldPassword, String newPassword, PasswordEncoder passwordEncoder) {
        if (oldPassword.equals(newPassword)) {
            throw new InvalidPasswordException("New password must be different from old password");
        }

        if (!passwordEncoder.matches(oldPassword, this.passwordHash)) {
            throw new InvalidPasswordException("Old password does not match");
        }

        this.passwordHash = passwordEncoder.encode(newPassword);
    }

    /**
     * Reset password (without old password validation)
     */
    public void resetPassword(String newPassword, PasswordEncoder passwordEncoder) {
        this.passwordHash = passwordEncoder.encode(newPassword);
    }

    /**
     * Update login timestamp
     */
    public void recordLogin() {
        this.lastLoginAt = Instant.now();
    }

    /**
     * Update avatar information
     */
    public void updateAvatar(String avatarUrl, String avatarPublicId) {
        this.avatarUrl = avatarUrl;
        this.avatarPublicId = avatarPublicId;
    }

    /**
     * Check if account has avatar
     */
    public boolean hasAvatar() {
        return this.avatarPublicId != null && !this.avatarPublicId.isEmpty();
    }

    /**
     * Get old avatar public ID for deletion
     */
    public String getOldAvatarPublicId() {
        return this.avatarPublicId;
    }

    public void suspend() {
        if (status != AccountStatus.ACTIVE) {
            throw new InvalidStatusException("Only ACTIVE account can be suspended");
        }
        status = AccountStatus.SUSPENDED;
    }

    /**
     * Unlock a suspended account
     */
    public void unlock() {
        if (status != AccountStatus.SUSPENDED) {
            throw new InvalidStatusException("Only SUSPENDED account can be unlocked");
        }
        status = AccountStatus.ACTIVE;
    }

    /**
     * Reject account
     */
    public void reject() {
        this.status = AccountStatus.REJECTED;
    }

    /**
     * Deactivate account
     */
    public void deactivate() {
        if (this.status == AccountStatus.ACTIVE) {
            this.status = AccountStatus.DEACTIVATED;
        } else {
            throw new InvalidStatusException("Can only deactivate active accounts");
        }
    }

    /**
     * Reactivate account
     */
    public void reactivate() {
        if (this.status == AccountStatus.DEACTIVATED) {
            this.status = AccountStatus.ACTIVE;
        } else {
            throw new InvalidStatusException("Can only reactivate deactivated accounts");
        }
    }

    /**
     * Verify account has required role
     */
    public void requireRole(Role requiredRole) {
        if (this.role != requiredRole) {
            throw new UnauthorizedException("Access denied for role: " + this.role);
        }
    }

    /**
     * Verify account is active
     */
    public void requireActive() {
        if (!isActive()) {
            throw new UnauthorizedException("Account is not active");
        }
    }

    /**
     * Check if this is a teacher account
     */
    public boolean isTeacher() {
        return this.role == Role.TEACHER;
    }

    /**
     * Check if this is a student account
     */
    public boolean isStudent() {
        return this.role == Role.STUDENT;
    }

    /**
     * Check if this is an admin account
     */
    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public void verifyToLogin(){
        if (this.status == AccountStatus.PENDING_EMAIL || this.status == AccountStatus.SUSPENDED || this.status == AccountStatus.DEACTIVATED) {
            throw new UsernameNotFoundException("User account is not activated.");
        }
    }

}

