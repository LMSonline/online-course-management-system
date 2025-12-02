package vn.uit.lms.core.repository.log;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.log.UserActivityLog;

public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {}

