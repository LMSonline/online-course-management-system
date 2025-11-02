package vn.uit.lms.core.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "account_action_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountActionLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account targetAccount;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", length = 32, nullable = false)
    private AccountActionType actionType;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", nullable = false)
    private Account performedBy;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "old_status", length = 64)
    private String oldStatus;

    @Column(name = "new_status", length = 64)
    private String newStatus;

}

