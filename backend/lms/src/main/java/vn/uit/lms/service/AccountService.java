package vn.uit.lms.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.EmailVerification;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.EmailVerificationRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.dto.request.ReqLoginDTO;
import vn.uit.lms.shared.exception.EmailAlreadyUsedException;
import vn.uit.lms.shared.exception.UsernameAlreadyUsedException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final MailService emailService;
    private final EmailVerificationRepository emailVerificationRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public AccountService(AccountRepository accountRepository,
                          MailService emailService,
                          EmailVerificationRepository emailVerificationRepository,
                          AuthenticationManagerBuilder authenticationManagerBuilder) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.emailVerificationRepository = emailVerificationRepository;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @Transactional
    public Account registerAccount(Account account) {

        accountRepository.findOneByUsername(account.getUsername())
                        .ifPresent(existingAccount -> {
                            boolean removed = removeNonActivatedAccount(existingAccount);
                            if (!removed) {
                                throw new UsernameAlreadyUsedException();
                            }
                        });

        accountRepository.findOneByEmailIgnoreCase(account.getEmail())
                        .ifPresent(existingAccount -> {
                            boolean removed = removeNonActivatedAccount(existingAccount);
                            if (!removed) {
                                throw new EmailAlreadyUsedException();
                            }
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

        //send activation email
        emailService.sendActivationEmail(saved, token);

        return saved;
    }

    public boolean removeNonActivatedAccount(Account existingAccount) {

        if (existingAccount.getStatus() == AccountStatus.PENDING_EMAIL) {
            accountRepository.delete(existingAccount);
            accountRepository.flush();
            return true;
        }
        return false;

    }

    public void login(ReqLoginDTO reqLoginDTO) {

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(reqLoginDTO.getLogin(), reqLoginDTO.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return;

    }



}
