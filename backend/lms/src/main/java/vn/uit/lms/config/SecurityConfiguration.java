package vn.uit.lms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private CustomUserDetailService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationEntryPoint customAuthenticationEntryPoint) throws Exception {
        String[] whiteList = {
                "/",
                "/api/v1/auth/register",
                "/api/v1/auth/login",
                "/api/v1/auth/refresh",
                "/api/v1/auth/verify-email",
                "/api/v1/auth/password/forgot",
                "/api/v1/auth/password/reset",
                "/api/v1/auth/resend-verification",
                "/api/v1/public/**",
                "/api/v1/categories/tree",
                "/api/v1/categories/*",
                "/api/v1/categories/slug/*",
                "/api/v1/tags",
                "/api/v1/courses",
                "/api/v1/courses/*",
                "/api/v1/courses/**",
                "/api/v1/students/*",
                "/api/v1/students/**",
                "/api/v1/enrollments/*",
                "/api/v1/enrollments/**",
                "/api/v1/lessons/*",
                "/api/v1/lessons/**",
                "/api/v1/chapters/*",
                "/api/v1/chapters/**",
                "/api/v1/files/*",
                "/api/v1/files/**",
                "/api/v1/courses/*/reviews",
                "/api/v1/courses/*/rating-summary",
                "/api/v1/courses/*/enroll",
                "/api/v1/courses/*/enrollments",
                "/api/v1/courses/*/enrollment-stats",
                "/api/v1/courses/*/versions",
                "/api/v1/courses/*/versions/*",
                "/api/v1/courses/*/versions/**",
                "/api/v1/courses/*/progress-stats",
                "/api/v1/lessons/*/resources",
                "/api/v1/lessons/*/resources/**",
                "/storage/**",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/api-docs",
                "/swagger-ui.html",
                "/actuator/health"
        };


        http.csrf(c -> c.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(whiteList)
                        .permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .jwt(Customizer.withDefaults())
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
