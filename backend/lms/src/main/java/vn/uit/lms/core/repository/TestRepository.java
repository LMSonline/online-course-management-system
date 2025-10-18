package vn.uit.lms.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.shared.entity.TestEntity;

public interface TestRepository extends JpaRepository<TestEntity, Long> {
}
