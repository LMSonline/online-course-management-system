package vn.uit.lms.shared.dto.response.enrollment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinalExamEligibilityResponse {

    private Long enrollmentId;

    private Boolean isEligible;

    private String reason;

    private Float currentProgress;

    private Float requiredProgress;

    private Integer completedLessons;

    private Integer totalLessons;
}

