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

@Service
public class CustomUserDetailService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailService.class);

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Load user details from database for Spring Security authentication.
     * Accepts either username or email as the login identifier.
     *
     * @param username the login input (username or email)
     * @return a Spring Security UserDetails object
     * @throws UsernameNotFoundException if user not found or not activated
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
