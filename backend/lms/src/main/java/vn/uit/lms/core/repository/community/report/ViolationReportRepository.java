package vn.uit.lms.core.repository.community.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.community.report.ViolationReport;

import java.util.List;

@Repository
public interface ViolationReportRepository extends JpaRepository<ViolationReport, Long> {

    Page<ViolationReport> findByReporter(Account reporter, Pageable pageable);
}
