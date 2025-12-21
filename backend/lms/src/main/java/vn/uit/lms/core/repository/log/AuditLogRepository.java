package vn.uit.lms.core.repository.log;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.domain.log.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByTableNameContainingIgnoreCase(String table, Pageable pageable);
}
