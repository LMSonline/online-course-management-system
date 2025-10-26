package vn.uit.lms.service;

import org.springdoc.core.service.SecurityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.RefreshToken;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.RefreshTokenRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.request.ReqRefreshTokenDTO;
import vn.uit.lms.shared.dto.response.ResLoginDTO;
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
     * - Validate and revoke the old refresh token.
     * - Generate a new access token and refresh token.
     */
    @Transactional
    public ResLoginDTO refreshAccessToken(ReqRefreshTokenDTO reqRefreshTokenDTO) {
        Instant now = Instant.now();

        // Hash the incoming refresh token
        String tokenHash = TokenHashUtil.hashToken(reqRefreshTokenDTO.getRefreshToken());

        // Find refresh token in database
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        // Validate token status
        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("Refresh token revoked");
        }
        if (refreshToken.getExpiresAt().isBefore(now)) {
            throw new InvalidTokenException("Refresh token expired");
        }

        Account accountDB = refreshToken.getAccount();

        // Revoke old refresh token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        // Map account to response DTO
        ResLoginDTO resLoginDTO;
        if (accountDB.getRole() == Role.STUDENT) {
            Student student = studentRepository.findByAccount(accountDB)
                    .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
            resLoginDTO = AccountMapper.studentToResLoginDTO(student);
        } else if (accountDB.getRole() == Role.TEACHER) {
            Teacher teacher = teacherRepository.findByAccount(accountDB)
                    .orElseThrow(() -> new UserNotActivatedException("Account not activated"));
            resLoginDTO = AccountMapper.teacherToResLoginDTO(teacher);
        } else {
            throw new InvalidTokenException("Unknown role");
        }

        // Generate new access token
        String newAccessToken = securityUtils.createAccessToken(accountDB.getEmail(), resLoginDTO);
        Instant accessTokenExpiresAt = now.plus(securityUtils.getAccessTokenExpiration(), ChronoUnit.SECONDS);
        resLoginDTO.setAccessToken(newAccessToken);
        resLoginDTO.setAccessTokenExpiresAt(accessTokenExpiresAt);

        // Generate new refresh token
        String newRefreshTokenPlain = securityUtils.createRefreshToken(accountDB.getEmail());
        String newRefreshTokenHash = TokenHashUtil.hashToken(newRefreshTokenPlain);
        Instant refreshTokenExpiresAt = now.plus(securityUtils.getRefreshTokenExpiration(), ChronoUnit.SECONDS);

        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setAccount(accountDB);
        newRefreshToken.setTokenHash(newRefreshTokenHash);
        newRefreshToken.setExpiresAt(refreshTokenExpiresAt);
        newRefreshToken.setDeviceInfo(reqRefreshTokenDTO.getDeviceInfo() != null
                ? refreshToken.getDeviceInfo() : "Unknown device");
        newRefreshToken.setIpAddress(reqRefreshTokenDTO.getIpAddress());
        newRefreshToken.setRevoked(false);
        refreshTokenRepository.save(newRefreshToken);

        resLoginDTO.setRefreshToken(newRefreshTokenPlain);
        resLoginDTO.setRefreshTokenExpiresAt(refreshTokenExpiresAt);

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

        if (!refreshToken.isRevoked()) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
        }
    }
}

