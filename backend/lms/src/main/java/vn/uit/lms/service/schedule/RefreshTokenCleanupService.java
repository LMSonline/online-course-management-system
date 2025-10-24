package vn.uit.lms.service.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.repository.RefreshTokenRepository;

import java.time.Instant;

@Service
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenCleanupService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void removeExpiredTokens() {
        Instant now = Instant.now();
        refreshTokenRepository.deleteAllByExpiresAtBefore(now);
    }
}
