package vn.uit.lms.core.repository.system;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.domain.system.SystemSetting;

import java.util.Optional;

public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    Optional<SystemSetting> findByKeyName(String keyName);
}
