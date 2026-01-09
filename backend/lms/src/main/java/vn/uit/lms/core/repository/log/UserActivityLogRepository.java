package vn.uit.lms.core.repository.log;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.domain.log.UserActivityLog;

import java.util.List;

public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
	List<UserActivityLog> findByAccountIdAndActionTypeOrderByCreatedAtDesc(Long accountId, String actionType);
}

