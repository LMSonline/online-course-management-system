package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.EmailVerification;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.EmailVerificationRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Language;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.exception.DuplicateResourceException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final MailService emailService;
    private final EmailVerificationRepository emailVerificationRepository;

    public AccountService(AccountRepository accountRepository, MailService emailService, EmailVerificationRepository emailVerificationRepository) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.emailVerificationRepository = emailVerificationRepository;
    }

    @Transactional
    public Account createNewAccount(Account account) {

        accountRepository.findByEmailOrUsername(account.getEmail(), account.getUsername())
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Account with email or username already exists.");
                });


        account.setStatus(AccountStatus.PENDING_EMAIL);

        Account saved = accountRepository.save(account);

        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);

        EmailVerification verification = EmailVerification.builder()
                .account(saved)
                .token(token)
                .tokenType(TokenType.VERIFY_EMAIL)
                .expiresAt(expiresAt)
                .isUsed(false)
                .build();

        emailVerificationRepository.save(verification);

        //
        emailService.sendActivationEmail(saved, token);

        return saved;
    }



}
