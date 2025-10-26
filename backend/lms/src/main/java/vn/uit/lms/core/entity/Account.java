package vn.uit.lms.core.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Language;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Account extends BaseEntity {

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

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Size(min = 2, max = 10)
    @Column(name = "lang_key", length = 10)
    private String langKey = Language.VI.getCode();

}
