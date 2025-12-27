package vn.uit.lms.core.repository.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.billing.RevenueShareConfig;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RevenueShareConfigRepository extends JpaRepository<RevenueShareConfig, Long> {

    List<RevenueShareConfig> findByIsActiveTrue();

    Optional<RevenueShareConfig> findByCategoryIdAndIsActiveTrue(Long categoryId);

    @Query("SELECT r FROM RevenueShareConfig r WHERE r.isActive = true " +
           "AND r.effectiveFrom <= :date " +
           "AND (r.effectiveTo IS NULL OR r.effectiveTo >= :date)")
    List<RevenueShareConfig> findActiveOnDate(@Param("date") LocalDate date);

    @Query("SELECT r FROM RevenueShareConfig r WHERE r.categoryId = :categoryId " +
           "AND r.isActive = true " +
           "AND r.effectiveFrom <= :date " +
           "AND (r.effectiveTo IS NULL OR r.effectiveTo >= :date)")
    Optional<RevenueShareConfig> findByCategoryAndDate(
            @Param("categoryId") Long categoryId,
            @Param("date") LocalDate date
    );
}
