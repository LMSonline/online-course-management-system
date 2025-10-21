package vn.uit.lms.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.EmailVerification;

import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByToken(String token);
}
