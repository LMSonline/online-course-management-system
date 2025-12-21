package vn.uit.lms.core.repository.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.domain.billing.RevenueShareConfig;

public interface RevenueShareConfigRepository extends JpaRepository<RevenueShareConfig, Long> {
}
