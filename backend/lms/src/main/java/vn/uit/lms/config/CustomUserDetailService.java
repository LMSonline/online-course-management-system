package vn.uit.lms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.shared.constant.AccountStatus;

/**
 * Custom implementation of {@link UserDetailsService} for Spring Security authentication.
 * <p>
 * This service loads user information from the database using either username or email
 * as the login credential and builds a {@link UserDetails} object used by Spring Security.
 * </p>
 */
@Service
public class CustomUserDetailService implements UserDetailsService {

    /**
     * Logger for debugging authentication flow.
     */
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailService.class);

    /**
     * Repository for accessing account data from the database.
     */
    @Autowired
    private AccountRepository accountRepository;

    /**
     * Loads user-specific data for authentication.
     * <p>
     * The method first determines whether the input is an email or a username,
     * retrieves the corresponding account, checks if it is active, and then
     * constructs a Spring Security {@link UserDetails} object.
     * </p>
     *
     * @param username the login identifier (username or email)
     * @return {@link UserDetails} containing user credentials and authorities
     * @throws UsernameNotFoundException if the user does not exist or is not active
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account accountDB;

        // Determine login type (email or username)
        if (username.contains("@")) {
            log.debug("Authenticating user by email: {}", username);

            accountDB = accountRepository.findOneByEmailIgnoreCase(username)
                    .orElseThrow(() -> {
                        log.warn("Authentication failed: email not found [{}]", username);
                        return new UsernameNotFoundException("User not found with email: " + username);
                    });

        } else {
            log.debug("Authenticating user by username: {}", username);

            accountDB = accountRepository.findOneByUsername(username)
                    .orElseThrow(() -> {
                        log.warn("Authentication failed: username not found [{}]", username);
                        return new UsernameNotFoundException("User not found with username: " + username);
                    });
        }

        // Verify activation status
        if (accountDB.getStatus() != AccountStatus.ACTIVE) {
            log.warn("Authentication failed: account not activated [{}]", username);
            throw new UsernameNotFoundException("User account is not activated: " + username);
        }

        // Build Spring Security user details
        UserDetails userDetails = User.builder()
                .username(accountDB.getEmail())
                .password(accountDB.getPasswordHash())
                .roles(accountDB.getRole().name())
                .build();

        log.debug("Successfully loaded user details for [{}]", username);
        return userDetails;
    }
}
