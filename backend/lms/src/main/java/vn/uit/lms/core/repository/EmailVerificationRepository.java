package vn.uit.lms.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.EmailVerification;
import vn.uit.lms.shared.constant.TokenType;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByTokenHash(String tokenHash);

    @Query("SELECT COUNT(e) FROM EmailVerification e WHERE e.account = :account AND e.createdAt > :since AND e.tokenType = :tokenType")
    long countByAccountAndCreatedAtAfterAndTokenType(
            @Param("account") Account account,
            @Param("since") Instant since,
            @Param("tokenType") TokenType tokenType
    );
}
