package vn.uit.lms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

/**
 * Initializes a default administrator account when the application starts.
 *
 * <p>This ensures that at least one admin exists in the system, allowing
 * initial management access right after deployment.</p>
 */
@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminInitializer(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Runs automatically after the Spring context is initialized.
     *
     * <p>If no admin account exists, this method creates one using the
     * configuration values from application.yml.</p>
     */
    @Override
    public void run(String... args) {
        if (accountRepository.existsByRole(Role.ADMIN)) {
            logger.info("Admin account already exists. Skipping initialization.");
            return;
        }

        try {
            Account admin = new Account();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setStatus(AccountStatus.ACTIVE);

            accountRepository.save(admin);

            logger.info("Default admin account created successfully.");
            logger.info("Username: {} | Email: {} | Password: {}", adminUsername, adminEmail, adminPassword);

        } catch (Exception e) {
            logger.error("Failed to create default admin account.", e);
        }
    }
}
