package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.RefreshToken;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.repository.RefreshTokenRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.dto.request.auth.ReqRefreshTokenDTO;
import vn.uit.lms.shared.dto.response.auth.ResLoginDTO;
import vn.uit.lms.shared.exception.InvalidTokenException;
import vn.uit.lms.shared.exception.UserNotActivatedException;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.TokenHashUtil;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SecurityUtils securityUtils;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               StudentRepository studentRepository,
                               TeacherRepository teacherRepository,
                               SecurityUtils securityUtils) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.securityUtils = securityUtils;
    }

    /**
     * Refresh an expired access token using a valid refresh token.
     * - Validate and rotate the refresh token.
     * - Generate a new access token.
     */
    @Transactional
    public ResLoginDTO refreshAccessToken(ReqRefreshTokenDTO reqRefreshTokenDTO) {
        Instant now = Instant.now();

        // Hash the incoming refresh token and find it in database
        String tokenHash = TokenHashUtil.hashToken(reqRefreshTokenDTO.getRefreshToken());
        RefreshToken oldRefreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        // Validate token (throws exception if invalid)
        oldRefreshToken.validate();

        Account accountDB = oldRefreshToken.getAccount();

        // Generate new refresh token plain text
        String newRefreshTokenPlain = securityUtils.createRefreshToken(accountDB.getEmail());

        // Rotate the refresh token (revokes old, creates new)
        RefreshToken newRefreshToken = oldRefreshToken.rotate(
                newRefreshTokenPlain,
                reqRefreshTokenDTO.getIpAddress(),
                securityUtils.getRefreshTokenExpiration()
        );

        // Save both tokens (old is revoked, new is created)
        refreshTokenRepository.save(oldRefreshToken);
        refreshTokenRepository.save(newRefreshToken);

        // Map account to response DTO based on role
        ResLoginDTO resLoginDTO = mapAccountToLoginDTO(accountDB);

        // Generate new access token
        String newAccessToken = securityUtils.createAccessToken(accountDB.getEmail(), resLoginDTO);
        Instant accessTokenExpiresAt = now.plus(securityUtils.getAccessTokenExpiration(), ChronoUnit.SECONDS);

        resLoginDTO.setAccessToken(newAccessToken);
        resLoginDTO.setAccessTokenExpiresAt(accessTokenExpiresAt);
        resLoginDTO.setRefreshToken(newRefreshTokenPlain);
        resLoginDTO.setRefreshTokenExpiresAt(newRefreshToken.getExpiresAt());

        return resLoginDTO;
    }

    /**
     * Revoke an existing refresh token (logout or manual invalidation).
     */
    @Transactional
    public void revokeRefreshToken(String refreshTokenPlain) {
        String tokenHash = TokenHashUtil.hashToken(refreshTokenPlain);

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        refreshToken.revoke();
        refreshTokenRepository.save(refreshToken);
    }

    /**
     * Issue a new refresh token for an account during login.
     */
    @Transactional
    public RefreshToken issueRefreshToken(Account account, String tokenPlain,
                                          String deviceInfo, String ipAddress) {
        RefreshToken refreshToken = RefreshToken.issue(
                account,
                tokenPlain,
                deviceInfo,
                ipAddress,
                securityUtils.getRefreshTokenExpiration()
        );

        return refreshTokenRepository.save(refreshToken);
    }


    /**
     * Helper method to map account to login DTO based on role.
     */
    private ResLoginDTO mapAccountToLoginDTO(Account account) {
        return switch (account.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(account)
                        .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
                yield AccountMapper.studentToResLoginDTO(student);
            }
            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(account)
                        .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
                yield AccountMapper.teacherToResLoginDTO(teacher);
            }
            case ADMIN -> AccountMapper.adminToResLoginDTO(account);
            default -> throw new IllegalStateException("Unexpected role: " + account.getRole());
        };
    }
}

