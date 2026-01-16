package vn.uit.lms.core.domain.log;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.AuditAction;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

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

    @Column(name = "changed_data")
    @JdbcTypeCode(SqlTypes.JSON)
    private String changedData;

    private Long userAccountId;
    private String ipAddress;

}
