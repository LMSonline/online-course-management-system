package vn.uit.lms.controller.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.EmailVerificationService;
import vn.uit.lms.shared.dto.request.RegisterRequest;
import vn.uit.lms.shared.dto.response.RegisterResponse;
import vn.uit.lms.shared.mapper.AccountMapper;
import vn.uit.lms.shared.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AccountService accountService;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AccountService accountService, PasswordEncoder passwordEncoder, EmailVerificationService emailVerificationService) {
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/register")
    @ApiMessage("Register new account")
    public ResponseEntity<RegisterResponse> registerAccount(@Valid @RequestBody RegisterRequest accountRequest) {
        Account account = AccountMapper.toEntity(accountRequest);
        account.setPasswordHash(this.passwordEncoder.encode(accountRequest.getPassword()));
        Account accountDB = this.accountService.createNewAccount(account);
        RegisterResponse response = AccountMapper.toResponse(accountDB);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        this.emailVerificationService.verifyToken(token);
        return ResponseEntity.ok("Your email has been successfully verified!");
    }

}
