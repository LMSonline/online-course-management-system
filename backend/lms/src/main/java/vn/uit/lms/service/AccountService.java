package vn.uit.lms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.EmailVerification;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.EmailVerificationRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.dto.request.ReqLoginDTO;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
import vn.uit.lms.shared.exception.EmailAlreadyUsedException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UserNotActivatedException;
import vn.uit.lms.shared.exception.UsernameAlreadyUsedException;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.SecurityUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final MailService emailService;
    private final EmailVerificationRepository emailVerificationRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtils securityUtils;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    @Value("${jwt.access-token.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    public AccountService(AccountRepository accountRepository,
                          MailService emailService,
                          EmailVerificationRepository emailVerificationRepository,
                          AuthenticationManagerBuilder authenticationManagerBuilder,
                          SecurityUtils securityUtils,
                          StudentRepository studentRepository,
                          TeacherRepository teacherRepository) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.emailVerificationRepository = emailVerificationRepository;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtils = securityUtils;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
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

    public ResLoginDTO login(ReqLoginDTO reqLoginDTO) {

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(reqLoginDTO.getLogin(), reqLoginDTO.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO resLoginDTO = new ResLoginDTO();
        Account accountDB = accountRepository.findOneByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if(accountDB.getRole() == Role.STUDENT) {

            Student student = studentRepository.findByAccount(accountDB).orElseThrow(
                    () -> new UserNotActivatedException("Account not activated"));

            resLoginDTO = AccountMapper.studentToResLoginDTO(student);
        }else if(accountDB.getRole() == Role.TEACHER) {
            Teacher teacher = teacherRepository.findByAccount(accountDB).orElseThrow(
                    () -> new UserNotActivatedException("Account not activated"));

            resLoginDTO = AccountMapper.teacherToResLoginDTO(teacher);
        }

        String accessToken = securityUtils.createAccessToken(authentication.getName(), resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);
        Instant now = Instant.now();
        resLoginDTO.setAccessTokenExpiresAt(now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS));
        resLoginDTO.setRefreshTokenExpiresAt(now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS));


        return resLoginDTO;

    }



}
