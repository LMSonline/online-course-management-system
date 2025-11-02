package vn.uit.lms.core.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.AccountActionLog;
import vn.uit.lms.shared.constant.AccountActionType;

public interface AccountActionLogRepository extends JpaRepository<AccountActionLog, Long> {
    Page<AccountActionLog> findByTargetAccount(Account targetAccount, Pageable pg);
    Page<AccountActionLog> findByTargetAccountAndActionType(Account targetAccount, AccountActionType actionType, Pageable pg);

}

