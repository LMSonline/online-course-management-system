package vn.uit.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.AccountActionLog;
import vn.uit.lms.core.repository.AccountActionLogRepository;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class AccountActionLogService {
    private final AccountActionLogRepository repo;
    private final AccountRepository accountRepository;

    public AccountActionLog logAction(Long targetAccountId,
                                      AccountActionType type,
                                      String reason,
                                      Long performedById,
                                      String ipAddress,
                                      String oldStatus,
                                      String newStatus) {

        Account target = accountRepository.getReferenceById(targetAccountId);
        Account performer = accountRepository.getReferenceById(performedById);

        AccountActionLog log = AccountActionLog.builder()
                .targetAccount(target)
                .actionType(type)
                .reason(reason)
                .performedBy(performer)
                .ipAddress(ipAddress)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .build();

        return repo.save(log);
    }

    public Page<AccountActionLog> getLogsForAccount(Long accountId, AccountActionType actionType, Pageable pageable){
        Account accountDB = accountRepository.findById(accountId).orElseThrow(
                () -> new ResourceNotFoundException("Account with id " + accountId + " not found")
        );

        if(actionType != null){
            return repo.findByTargetAccountAndActionType(accountDB, actionType, pageable);
        } else {
            return repo.findByTargetAccount(accountDB, pageable);
    }
    }
}
