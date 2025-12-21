package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "account_action_log")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountActionLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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


    /**
     * Create an approval log
     */
    public static AccountActionLog createApprovalLog(
            Account targetAccount,
            Account performedBy,
            String reason,
            String ipAddress,
            String oldStatus,
            String newStatus
    ) {
        return AccountActionLog.builder()
                .targetAccount(targetAccount)
                .actionType(AccountActionType.APPROVE)
                .reason(reason)
                .performedBy(performedBy)
                .ipAddress(ipAddress)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .build();
    }

    /**
     * Create a rejection log
     */
    public static AccountActionLog createRejectionLog(
            Account targetAccount,
            Account performedBy,
            String reason,
            String ipAddress,
            String oldStatus,
            String newStatus
    ) {
        return AccountActionLog.builder()
                .targetAccount(targetAccount)
                .actionType(AccountActionType.REJECT)
                .reason(reason)
                .performedBy(performedBy)
                .ipAddress(ipAddress)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .build();
    }

    /**
     * Create a status change log
     */
    public static AccountActionLog createStatusChangeLog(
            Account targetAccount,
            Account performedBy,
            AccountActionType actionType,
            String reason,
            String ipAddress,
            String oldStatus,
            String newStatus
    ) {
        return AccountActionLog.builder()
                .targetAccount(targetAccount)
                .actionType(actionType)
                .reason(reason)
                .performedBy(performedBy)
                .ipAddress(ipAddress)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .build();
    }

}

