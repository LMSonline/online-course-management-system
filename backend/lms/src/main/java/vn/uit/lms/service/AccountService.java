package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Language;
import vn.uit.lms.shared.exception.DuplicateResourceException;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final MailService emailService;

    public AccountService(AccountRepository accountRepository, MailService emailService) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Account createNewAccount(Account account) {
        // Kiểm tra trùng email hoặc username
        accountRepository.findByEmailOrUsername(account.getEmail(), account.getUsername())
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Account with email or username already exists.");
                });

        // Đặt trạng thái ban đầu
        account.setStatus(AccountStatus.PENDING_EMAIL);
        account.setLangKey(Language.VI.getCode()); // nếu cần mặc định ngôn ngữ

        // Lưu vào DB trước (để có ID)
        Account saved = accountRepository.save(account);

        // Gửi email sau khi lưu
        emailService.sendCreationEmail(saved);

        return saved;
    }

}
