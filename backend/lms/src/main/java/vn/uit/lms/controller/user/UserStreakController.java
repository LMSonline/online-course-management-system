package vn.uit.lms.core.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.uit.lms.core.domain.log.UserActivityLog;
import vn.uit.lms.core.repository.log.UserActivityLogRepository;
import vn.uit.lms.shared.dto.response.ApiResponse;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users/me")
public class UserStreakController {

    @Autowired
    private UserActivityLogRepository logRepo;

    @GetMapping("/streak")
    public ApiResponse<Integer> getStreak(@AuthenticationPrincipal(expression = "id") Long accountId) {
        List<UserActivityLog> logs = logRepo.findByAccountIdAndActionTypeOrderByCreatedAtDesc(accountId, "LOGIN");
        Set<LocalDate> accessDays = logs.stream()
                .map(log -> log.getCreatedAt().toLocalDate())
                .collect(Collectors.toCollection(TreeSet::new));

        int streak = 0;
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        while (accessDays.contains(today.minusDays(streak))) {
            streak++;
        }
        return ApiResponse.success(streak);
    }
}
