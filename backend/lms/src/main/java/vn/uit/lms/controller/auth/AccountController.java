package vn.uit.lms.controller.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.util.JsonViewUtils;
import vn.uit.lms.shared.util.annotation.ApiMessage;
import vn.uit.lms.shared.view.Views;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;
    private final static Logger log = LoggerFactory.getLogger(AccountController.class);

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/me")
    @ApiMessage("Get profile of the authenticated user")
    public ResponseEntity<ApiResponse<Object>> getProfile() {

        AccountProfileResponse response = accountService.getProfile();

        // Dynamically pick JsonView class based on role
        Class<?> view = switch (response.getRole()) {
            case STUDENT -> Views.Student.class;
            case TEACHER -> Views.Teacher.class;
            case ADMIN -> Views.Admin.class;
        };

        // Use JsonViewUtils for clean filtering
        Object filteredData = JsonViewUtils.applyView(response, view);

        ApiResponse<Object> res = new ApiResponse<>();
        res.setSuccess(true);
        res.setStatus(HttpStatus.OK.value());
        res.setCode("SUCCESS");
        res.setMessage("Request processed successfully: Get profile of the authenticated user");
        res.setData(filteredData);
        res.setTimestamp(Instant.now());

        return ResponseEntity.ok(res);
    }

}
