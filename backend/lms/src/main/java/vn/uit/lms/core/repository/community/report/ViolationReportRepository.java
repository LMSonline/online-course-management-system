package vn.uit.lms.core.repository.community.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.community.report.ViolationReport;

@Repository
public interface ViolationReportRepository extends JpaRepository<ViolationReport, Long> {

    Page<ViolationReport> findByReporter(Account reporter, Pageable pageable);
}
