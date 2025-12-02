package vn.uit.lms.core.entity.log;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.AuditAction;

@Getter
@Setter
@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tableName;
    private String recordId;

    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Column(columnDefinition = "JSON")
    private String changedData;

    private Long userAccountId;
    private String ipAddress;

    private java.time.LocalDateTime createdAt;
}
